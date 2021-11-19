# spinal-env-drive-core

## Classes

<dl>
<dt><a href="#SpinalDrive_Env">SpinalDrive_Env</a></dt>
<dd><p>Class representing the SpinalDrive Environnement</p>
</dd>
<dt><a href="#SpinalDrive_App_list">SpinalDrive_App_list</a></dt>
<dd><p>Class representing a list of applications unique</p>
</dd>
<dt><a href="#SpinalDrive_App">SpinalDrive_App</a></dt>
<dd><p>interface on an app</p>
</dd>
</dl>

<a name="SpinalDrive_Env"></a>

## SpinalDrive_Env
Class representing the SpinalDrive Environnement

**Kind**: global class  

* [SpinalDrive_Env](#SpinalDrive_Env)
    * [new SpinalDrive_Env()](#new_SpinalDrive_Env_new)
    * [.add_applications(key, app)](#SpinalDrive_Env+add_applications)
    * [.get_applications(key, d)](#SpinalDrive_Env+get_applications)

<a name="new_SpinalDrive_Env_new"></a>

### new SpinalDrive_Env()
Creates an instance of SpinalDrive_Env.

<a name="SpinalDrive_Env+add_applications"></a>

### spinalDrive_Env.add_applications(key, app)
add_navbar_application.

**Kind**: instance method of [<code>SpinalDrive_Env</code>](#SpinalDrive_Env)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | key string of the layer: `FolderExplorer` or 'FileExplorer' or `Inspector` or `FileExplorerCurrDir` |
| app | [<code>SpinalDrive_App</code>](#SpinalDrive_App) \| <code>any</code> | should be an SpinalDrive_App |

<a name="SpinalDrive_Env+get_applications"></a>

### spinalDrive_Env.get_applications(key, d)
get_applications

**Kind**: instance method of [<code>SpinalDrive_Env</code>](#SpinalDrive_Env)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | key string of the layer |
| d | <code>object</code> | dbject send to is_shown defined by each layout |

<a name="SpinalDrive_App_list"></a>

## SpinalDrive_App_list
Class representing a list of applications unique

**Kind**: global class  

* [SpinalDrive_App_list](#SpinalDrive_App_list)
    * [.push(obj)](#SpinalDrive_App_list+push)
    * [.remove_by_name(name)](#SpinalDrive_App_list+remove_by_name) ⇒ <code>boolean</code>
    * [.remove_by_id(id)](#SpinalDrive_App_list+remove_by_id) ⇒ [<code>SpinalDrive_App</code>](#SpinalDrive_App)
    * [.get(idx)](#SpinalDrive_App_list+get) ⇒ [<code>SpinalDrive_App</code>](#SpinalDrive_App)
    * [.length()](#SpinalDrive_App_list+length) ⇒ <code>number</code>
    * [.get_by_name(name)](#SpinalDrive_App_list+get_by_name) ⇒ [<code>SpinalDrive_App</code>](#SpinalDrive_App)

<a name="SpinalDrive_App_list+push"></a>

### spinalDrive_App_list.push(obj)
**Kind**: instance method of [<code>SpinalDrive_App_list</code>](#SpinalDrive_App_list)  

| Param | Type |
| --- | --- |
| obj | [<code>SpinalDrive_App</code>](#SpinalDrive_App) \| <code>any</code> | 

<a name="SpinalDrive_App_list+remove_by_name"></a>

### spinalDrive_App_list.remove_by_name(name) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>SpinalDrive_App_list</code>](#SpinalDrive_App_list)  
**Returns**: <code>boolean</code> - false if nothing to delete  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="SpinalDrive_App_list+remove_by_id"></a>

### spinalDrive_App_list.remove_by_id(id) ⇒ [<code>SpinalDrive_App</code>](#SpinalDrive_App)
**Kind**: instance method of [<code>SpinalDrive_App_list</code>](#SpinalDrive_App_list)  

| Param | Type |
| --- | --- |
| id | <code>number</code> | 

<a name="SpinalDrive_App_list+get"></a>

### spinalDrive_App_list.get(idx) ⇒ [<code>SpinalDrive_App</code>](#SpinalDrive_App)
**Kind**: instance method of [<code>SpinalDrive_App_list</code>](#SpinalDrive_App_list)  

| Param | Type |
| --- | --- |
| idx | <code>number</code> | 

<a name="SpinalDrive_App_list+length"></a>

### spinalDrive_App_list.length() ⇒ <code>number</code>
**Kind**: instance method of [<code>SpinalDrive_App_list</code>](#SpinalDrive_App_list)  
<a name="SpinalDrive_App_list+get_by_name"></a>

### spinalDrive_App_list.get_by_name(name) ⇒ [<code>SpinalDrive_App</code>](#SpinalDrive_App)
**Kind**: instance method of [<code>SpinalDrive_App_list</code>](#SpinalDrive_App_list)  
**Returns**: [<code>SpinalDrive_App</code>](#SpinalDrive_App) - returns 0 on notfound.  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="SpinalDrive_App"></a>

## SpinalDrive_App
interface on an app

**Kind**: global class  

* [SpinalDrive_App](#SpinalDrive_App)
    * [new SpinalDrive_App([name], [label], [id], [icon], [description])](#new_SpinalDrive_App_new)
    * [.action(params)](#SpinalDrive_App+action)
    * [.launch_action(params)](#SpinalDrive_App+launch_action)
    * [.is_shown(d)](#SpinalDrive_App+is_shown) ⇒ <code>boolean</code>

<a name="new_SpinalDrive_App_new"></a>

### new SpinalDrive_App([name], [label], [id], [icon], [description])
Creates an instance of SpinalDrive_App.


| Param | Type | Default |
| --- | --- | --- |
| [name] | <code>string</code> |  | 
| [label] | <code>string</code> |  | 
| [id] | <code>number</code> | <code>0</code> | 
| [icon] | <code>string</code> |  | 
| [description] | <code>string</code> |  | 

<a name="SpinalDrive_App+action"></a>

### spinalDrive_App.action(params)
Handler to the callback on click.
Method to be Overridden in child

**Kind**: instance method of [<code>SpinalDrive_App</code>](#SpinalDrive_App)  

| Param | Type |
| --- | --- |
| params | <code>any</code> | 

<a name="SpinalDrive_App+launch_action"></a>

### spinalDrive_App.launch_action(params)
Method called onclick will call this.action inside

**Kind**: instance method of [<code>SpinalDrive_App</code>](#SpinalDrive_App)  

| Param | Type |
| --- | --- |
| params | <code>any</code> | 

<a name="SpinalDrive_App+is_shown"></a>

### spinalDrive_App.is_shown(d) ⇒ <code>boolean</code>
method to know if the app is needed to be shown.

**Kind**: instance method of [<code>SpinalDrive_App</code>](#SpinalDrive_App)  
**Returns**: <code>boolean</code> - return true if need to be shown;  

| Param | Type | Description |
| --- | --- | --- |
| d | <code>Object</code> | object representing selection |

