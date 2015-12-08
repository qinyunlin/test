//store扩展：添加统计功能


Ext.data.SelfStore = function(config) {
	this.data = new Ext.util.MixedCollection(false);
	this.data.getKey = function(o) {
		return o.id;
	};

	this.baseParams = {};

	this.removed = [];

	if (config && config.data) {
		this.inlineData = config.data;
		delete config.data;
	}

	Ext.apply(this, config);

	this.paramNames = Ext
			.applyIf(this.paramNames || {}, this.defaultParamNames);

	if (this.url && !this.proxy) {
		this.proxy = new Ext.data.HttpProxy({
					url : this.url
				});
	}

	if (this.restful === true && this.proxy) {

		this.batch = false;
		Ext.data.Api.restify(this.proxy);
	}

	if (this.reader) { // reader passed
		if (!this.recordType) {
			this.recordType = this.reader.recordType;
		}
		if (this.reader.onMetaChange) {
			this.reader.onMetaChange = this.onMetaChange.createDelegate(this);
		}
		if (this.writer) { // writer passed
			this.writer.meta = this.reader.meta;
			this.pruneModifiedRecords = true;
		}
	}

	if (this.recordType) {

		this.fields = this.recordType.prototype.fields;
	}
	this.modified = [];

	this.addEvents(

			'datachanged',

			'metachange',

			'add',

			'remove',

			'update',

			'clear',

			'exception',

			'beforeload',

			'load',

			'loadexception',

			'beforewrite',

			'write');

	if (this.proxy) {
		this.relayEvents(this.proxy, ['loadexception', 'exception']);
	}

	if (this.writer) {
		this.on({
					scope : this,
					add : this.createRecords,
					remove : this.destroyRecord,
					update : this.updateRecord
				});
	}

	this.sortToggle = {};
	if (this.sortField) {
		this.setDefaultSort(this.sortField, this.sortDir);
	} else if (this.sortInfo) {
		this.setDefaultSort(this.sortInfo.field, this.sortInfo.direction);
	}

	Ext.data.SelfStore.superclass.constructor.call(this);

	if (this.id) {
		this.storeId = this.id;
		delete this.id;
	}
	if (this.storeId) {
		Ext.StoreMgr.register(this);
	}
	if (this.inlineData) {
		this.loadData(this.inlineData);
		delete this.inlineData;
	} else if (this.autoLoad) {
		this.load.defer(10, this, [typeof this.autoLoad == 'object'
						? this.autoLoad
						: undefined]);
	}
};
Ext.extend(Ext.data.SelfStore, Ext.util.Observable, {

			writer : undefined,

			remoteSort : false,

			autoDestroy : false,

			pruneModifiedRecords : false,

			lastOptions : null,

			autoSave : true,

			batch : true,

			restful : false,

			paramNames : undefined,

			countParams : {},

			defaultParamNames : {
				page : 'page',
				pageNo : 'pageNo',
				pageSize : 'pageSize',
				sort : 'sort',
				dir : 'dir'
			},

			destroy : function() {
				if (this.storeId) {
					Ext.StoreMgr.unregister(this);
				}
				this.data = null;
				Ext.destroy(this.proxy);
				this.reader = this.writer = null;
				this.purgeListeners();
			},

			add : function(records) {
				records = [].concat(records);
				if (records.length < 1) {
					return;
				}
				for (var i = 0, len = records.length; i < len; i++) {
					records[i].join(this);
				}
				var index = this.data.length;
				this.data.addAll(records);
				if (this.snapshot) {
					this.snapshot.addAll(records);
				}
				this.fireEvent('add', this, records, index);
			},

			addSorted : function(record) {
				var index = this.findInsertIndex(record);
				this.insert(index, record);
			},

			remove : function(record) {
				var index = this.data.indexOf(record);
				if (index > -1) {
					this.data.removeAt(index);
					if (this.pruneModifiedRecords) {
						this.modified.remove(record);
					}
					if (this.snapshot) {
						this.snapshot.remove(record);
					}
					this.fireEvent('remove', this, record, index);
				}
			},

			removeAt : function(index) {
				this.remove(this.getAt(index));
			},

			removeAll : function() {
				this.data.clear();
				if (this.snapshot) {
					this.snapshot.clear();
				}
				if (this.pruneModifiedRecords) {
					this.modified = [];
				}
				this.fireEvent('clear', this);
			},

			insert : function(index, records) {
				records = [].concat(records);
				for (var i = 0, len = records.length; i < len; i++) {
					this.data.insert(index, records[i]);
					records[i].join(this);
				}
				this.fireEvent('add', this, records, index);
			},

			indexOf : function(record) {
				return this.data.indexOf(record);
			},

			indexOfId : function(id) {
				return this.data.indexOfKey(id);
			},

			getById : function(id) {
				return this.data.key(id);
			},

			getAt : function(index) {
				return this.data.itemAt(index);
			},

			getRange : function(start, end) {
				return this.data.getRange(start, end);
			},

			// private
			storeOptions : function(o) {
				o = Ext.apply({}, o);
				delete o.callback;
				delete o.scope;
				this.lastOptions = o;
			},

			load : function(options) {
				options = options || {};
				this.storeOptions(options);
				if (this.sortInfo && this.remoteSort) {
					var pn = this.paramNames;
					options.params = options.params || {};
					options.params[pn.sort] = this.sortInfo.field;
					options.params[pn.dir] = this.sortInfo.direction;
				}
				try {
					return this.execute('read', null, options); // <-- null

				} catch (e) {
					this.handleException(e);
					return false;
				}
			},

			updateRecord : function(store, record, action) {
				if (action == Ext.data.Record.EDIT
						&& this.autoSave === true
						&& (!record.phantom || (record.phantom && record.isValid))) {
					this.save();
				}
			},

			createRecords : function(store, rs, index) {
				for (var i = 0, len = rs.length; i < len; i++) {
					if (rs[i].phantom && rs[i].isValid()) {
						rs[i].markDirty(); // <-- Mark new records dirty
						this.modified.push(rs[i]); // <-- add to modified
					}
				}
				if (this.autoSave === true) {
					this.save();
				}
			},

			destroyRecord : function(store, record, index) {
				if (this.modified.indexOf(record) != -1) { // <-- handled

					this.modified.remove(record);
				}
				if (!record.phantom) {
					this.removed.push(record);

					record.lastIndex = index;

					if (this.autoSave === true) {
						this.save();
					}
				}
			},

			execute : function(action, rs, options) {
				// blow up if action not Ext.data.CREATE, READ, UPDATE, DESTROY
				if (!Ext.data.Api.isAction(action)) {
					throw new Ext.data.Api.Error('execute', action);
				}
				// make sure options has a params key
				options = Ext.applyIf(options || {}, {
							params : {}
						});

				var doRequest = true;

				if (action === 'read') {
					doRequest = this.fireEvent('beforeload', this, options);
				} else {

					if (this.writer.listful === true && this.restful !== true) {
						rs = (Ext.isArray(rs)) ? rs : [rs];
					}

					else if (Ext.isArray(rs) && rs.length == 1) {
						rs = rs.shift();
					}

					if ((doRequest = this.fireEvent('beforewrite', this,
							action, rs, options)) !== false) {
						this.writer.write(action, options.params, rs);
					}
				}
				if (doRequest !== false) {

					var params = Ext.apply({}, options.params, this.baseParams);
					if (this.writer && this.proxy.url && !this.proxy.restful
							&& !Ext.data.Api.hasUniqueUrl(this.proxy, action)) {
						params.xaction = action;
					}

					this.proxy.request(Ext.data.Api.actions[action], rs,
							params, this.reader, this
									.createCallback(action, rs), this, options);
				}
				return doRequest;
			},

			save : function() {
				if (!this.writer) {
					throw new Ext.data.SelfStore.Error('writer-undefined');
				}

				if (this.removed.length) {
					this.doTransaction('destroy', this.removed);
				}

				var rs = [].concat(this.getModifiedRecords());
				if (!rs.length) { // Bail-out if empty...
					return true;
				}

				var phantoms = [];
				for (var i = rs.length - 1; i >= 0; i--) {
					if (rs[i].phantom === true) {
						var rec = rs.splice(i, 1).shift();
						if (rec.isValid()) {
							phantoms.push(rec);
						}
					} else if (!rs[i].isValid()) { // <-- while we're here,

						rs.splice(i, 1);
					}
				}
				// If we have valid phantoms, create them...
				if (phantoms.length) {
					this.doTransaction('create', phantoms);
				}

				if (rs.length) {
					this.doTransaction('update', rs);
				}
				return true;
			},

			doTransaction : function(action, rs) {
				function transaction(records) {
					try {
						this.execute(action, records);
					} catch (e) {
						this.handleException(e);
					}
				}
				if (this.batch === false) {
					for (var i = 0, len = rs.length; i < len; i++) {
						transaction.call(this, rs[i]);
					}
				} else {
					transaction.call(this, rs);
				}
			},

			createCallback : function(action, rs) {
				var actions = Ext.data.Api.actions;
				return (action == 'read') ? this.loadRecords : function(data,
						response, success) {

					this['on' + Ext.util.Format.capitalize(action) + 'Records'](
							success, rs, data);

					if (success === true) {
						this.fireEvent('write', this, action, data, response,
								rs);
					}
				};
			},

			clearModified : function(rs) {
				if (Ext.isArray(rs)) {
					for (var n = rs.length - 1; n >= 0; n--) {
						this.modified.splice(this.modified.indexOf(rs[n]), 1);
					}
				} else {
					this.modified.splice(this.modified.indexOf(rs), 1);
				}
			},

			reMap : function(record) {
				if (Ext.isArray(record)) {
					for (var i = 0, len = record.length; i < len; i++) {
						this.reMap(record[i]);
					}
				} else {
					delete this.data.map[record._phid];
					this.data.map[record.id] = record;
					var index = this.data.keys.indexOf(record._phid);
					this.data.keys.splice(index, 1, record.id);
					delete record._phid;
				}
			},

			onCreateRecords : function(success, rs, data) {
				if (success === true) {
					try {
						this.reader.realize(rs, data);
						this.reMap(rs);
					} catch (e) {
						this.handleException(e);
						if (Ext.isArray(rs)) {
							// Recurse to run back into the try {}.
							// DataReader#realize splices-off the rs until
							// empty.
							this.onCreateRecords(success, rs, data);
						}
					}
				}
			},

			onUpdateRecords : function(success, rs, data) {
				if (success === true) {
					try {
						this.reader.update(rs, data);
					} catch (e) {
						this.handleException(e);
						if (Ext.isArray(rs)) {

							this.onUpdateRecords(success, rs, data);
						}
					}
				}
			},

			onDestroyRecords : function(success, rs, data) {

				rs = (rs instanceof Ext.data.Record) ? [rs] : rs;
				for (var i = 0, len = rs.length; i < len; i++) {
					this.removed.splice(this.removed.indexOf(rs[i]), 1);
				}
				if (success === false) {

					for (i = rs.length - 1; i >= 0; i--) {
						this.insert(rs[i].lastIndex, rs[i]); // <-- lastIndex

					}
				}
			},

			handleException : function(e) {
				// @see core/Error.js
				Ext.handleError(e);
			},

			reload : function(options) {
				this.load(Ext.applyIf(options || {}, this.lastOptions));
			},

			loadRecords : function(o, options, success) {
				if (!o || success === false) {
					if (success !== false) {
						this.fireEvent('load', this, [], options);
					}
					if (options.callback) {
						options.callback.call(options.scope || this, [],
								options, false, o);
					}
					return;
				}
				var r = o.records, t;// = o.totalRecords || r.length;
				var this_temp = this;
				var param_t = "";
				var bp;

				for (bp in this.countParams) {
					param_t += "&" + bp + "=" + this.countParams[bp];
				}
				for (bp in this.baseParams) {
					if (bp != "type" && bp != "method") {
						param_t += "&" + bp + "=" + this.baseParams[bp];
					}
				}
				Ext.lib.Ajax.request("post", this.countUrl, {
							success : function(response) {
								var data = eval("(" + response.responseText
										+ ")");
								t = data.result || r.length;
								if (!options || options.add !== true) {
									if (this_temp.pruneModifiedRecords) {
										this_temp.modified = [];
									}
									for (var i = 0, len = r.length; i < len; i++) {
										r[i].join(this_temp);
									}
									if (this_temp.snapshot) {
										this_temp.data = this_temp.snapshot;
										delete this_temp.snapshot;
									}
									this_temp.data.clear();
									this_temp.data.addAll(r);
									this_temp.totalLength = t;
									this_temp.applySort();
									this_temp.fireEvent('datachanged',
											this_temp);
								} else {
									this_temp.totalLength = Math.max(t,
											this_temp.data.length + r.length);
									this_temp.add(r);
								}
								this_temp.fireEvent('load', this_temp, r,
										options);
								if (options.callback) {
									options.callback.call(options.scope
													|| this_temp, r, options,
											true);
								}
							},
							failure : function() {
							}
						}, param_t);
			},

			loadData : function(o, append) {
				var r = this.reader.readRecords(o);
				this.loadRecords(r, {
							add : append
						}, true);
			},

			getCount : function() {
				return this.data.length || 0;
			},

			getTotalCount : function() {
				return this.totalLength || 0;
			},

			getSortState : function() {
				return this.sortInfo;
			},

			// private
			applySort : function() {
				if (this.sortInfo && !this.remoteSort) {
					var s = this.sortInfo, f = s.field;
					this.sortData(f, s.direction);
				}
			},

			// private
			sortData : function(f, direction) {
				direction = direction || 'ASC';
				var st = this.fields.get(f).sortType;
				var fn = function(r1, r2) {
					var v1 = st(r1.data[f]), v2 = st(r2.data[f]);
					return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
				};
				this.data.sort(direction, fn);
				if (this.snapshot && this.snapshot != this.data) {
					this.snapshot.sort(direction, fn);
				}
			},

			setDefaultSort : function(field, dir) {
				dir = dir ? dir.toUpperCase() : 'ASC';
				this.sortInfo = {
					field : field,
					direction : dir
				};
				this.sortToggle[field] = dir;
			},

			sort : function(fieldName, dir) {
				var f = this.fields.get(fieldName);
				if (!f) {
					return false;
				}
				if (!dir) {
					if (this.sortInfo && this.sortInfo.field == f.name) { // toggle
						// sort
						// dir
						dir = (this.sortToggle[f.name] || 'ASC').toggle('ASC',
								'DESC');
					} else {
						dir = f.sortDir;
					}
				}
				var st = (this.sortToggle) ? this.sortToggle[f.name] : null;
				var si = (this.sortInfo) ? this.sortInfo : null;

				this.sortToggle[f.name] = dir;
				this.sortInfo = {
					field : f.name,
					direction : dir
				};
				if (!this.remoteSort) {
					this.applySort();
					this.fireEvent('datachanged', this);
				} else {
					if (!this.load(this.lastOptions)) {
						if (st) {
							this.sortToggle[f.name] = st;
						}
						if (si) {
							this.sortInfo = si;
						}
					}
				}
			},

			each : function(fn, scope) {
				this.data.each(fn, scope);
			},

			getModifiedRecords : function() {
				return this.modified;
			},

			// private
			createFilterFn : function(property, value, anyMatch, caseSensitive) {
				if (Ext.isEmpty(value, false)) {
					return false;
				}
				value = this.data.createValueMatcher(value, anyMatch,
						caseSensitive);
				return function(r) {
					return value.test(r.data[property]);
				};
			},

			sum : function(property, start, end) {
				var rs = this.data.items, v = 0;
				start = start || 0;
				end = (end || end === 0) ? end : rs.length - 1;

				for (var i = start; i <= end; i++) {
					v += (rs[i].data[property] || 0);
				}
				return v;
			},

			filter : function(property, value, anyMatch, caseSensitive) {
				var fn = this.createFilterFn(property, value, anyMatch,
						caseSensitive);
				return fn ? this.filterBy(fn) : this.clearFilter();
			},

			filterBy : function(fn, scope) {
				this.snapshot = this.snapshot || this.data;
				this.data = this.queryBy(fn, scope || this);
				this.fireEvent('datachanged', this);
			},

			query : function(property, value, anyMatch, caseSensitive) {
				var fn = this.createFilterFn(property, value, anyMatch,
						caseSensitive);
				return fn ? this.queryBy(fn) : this.data.clone();
			},

			queryBy : function(fn, scope) {
				var data = this.snapshot || this.data;
				return data.filterBy(fn, scope || this);
			},

			find : function(property, value, start, anyMatch, caseSensitive) {
				var fn = this.createFilterFn(property, value, anyMatch,
						caseSensitive);
				return fn ? this.data.findIndexBy(fn, null, start) : -1;
			},

			findExact : function(property, value, start) {
				return this.data.findIndexBy(function(rec) {
							return rec.get(property) === value;
						}, this, start);
			},

			findBy : function(fn, scope, start) {
				return this.data.findIndexBy(fn, scope, start);
			},

			collect : function(dataIndex, allowNull, bypassFilter) {
				var d = (bypassFilter === true && this.snapshot)
						? this.snapshot.items
						: this.data.items;
				var v, sv, r = [], l = {};
				for (var i = 0, len = d.length; i < len; i++) {
					v = d[i].data[dataIndex];
					sv = String(v);
					if ((allowNull || !Ext.isEmpty(v)) && !l[sv]) {
						l[sv] = true;
						r[r.length] = v;
					}
				}
				return r;
			},

			clearFilter : function(suppressEvent) {
				if (this.isFiltered()) {
					this.data = this.snapshot;
					delete this.snapshot;
					if (suppressEvent !== true) {
						this.fireEvent('datachanged', this);
					}
				}
			},

			isFiltered : function() {
				return this.snapshot && this.snapshot != this.data;
			},

			// private
			afterEdit : function(record) {
				if (this.modified.indexOf(record) == -1) {
					this.modified.push(record);
				}
				this.fireEvent('update', this, record, Ext.data.Record.EDIT);
			},

			// private
			afterReject : function(record) {
				this.modified.remove(record);
				this.fireEvent('update', this, record, Ext.data.Record.REJECT);
			},

			// private
			afterCommit : function(record) {
				this.modified.remove(record);
				this.fireEvent('update', this, record, Ext.data.Record.COMMIT);
			},

			commitChanges : function() {
				var m = this.modified.slice(0);
				this.modified = [];
				for (var i = 0, len = m.length; i < len; i++) {
					m[i].commit();
				}
			},

			rejectChanges : function() {
				var m = this.modified.slice(0);
				this.modified = [];
				for (var i = 0, len = m.length; i < len; i++) {
					m[i].reject();
				}
			},

			// private
			onMetaChange : function(meta, rtype, o) {
				this.recordType = rtype;
				this.fields = rtype.prototype.fields;
				delete this.snapshot;
				if (meta.sortInfo) {
					this.sortInfo = meta.sortInfo;
				} else if (this.sortInfo
						&& !this.fields.get(this.sortInfo.field)) {
					delete this.sortInfo;
				}
				this.modified = [];
				this.fireEvent('metachange', this, this.reader.meta);
			},

			// private
			findInsertIndex : function(record) {
				this.suspendEvents();
				var data = this.data.clone();
				this.data.add(record);
				this.applySort();
				var index = this.data.indexOf(record);
				this.data = data;
				this.resumeEvents();
				return index;
			},

			setBaseParam : function(name, value) {
				this.baseParams = this.baseParams || {};
				this.baseParams[name] = value;
			}
		});

Ext.reg('store_self', Ext.data.SelfStore);

Ext.data.SelfStore.Error = Ext.extend(Ext.Error, {
			name : 'Ext.data.SelfStore'
		});
Ext.apply(Ext.data.SelfStore.Error.prototype, {
	lang : {
		'writer-undefined' : 'Attempted to execute a write-action without a DataWriter installed.'
	}
});
