const _ = require("lodash");
const permissionModel = require('../models/permissions.model');
let collections  = [
	{ text: 'Admin Roles', value: 'adminroles' },
	{ text: 'Permissions', value: 'permissions' },
	{ text: 'Admin Users', value: 'adminusers' },
	{ text: 'Products', value: 'products' },
	{ text: 'Categories', value: 'categories' },
	{ text: 'Customers', value: 'customers' },
	{ text: 'Customers Groups', value: 'customersgroups' },
	{ text: 'Orders', value: 'orders' },
	{ text: 'Attributes', value: 'attributes' },
	{ text: 'Tags', value: 'tags' }
];

async function getPermission(roleID, parentID, modelName, permissionType) {
	let results = await permissionModel.find({ roleId: roleID, parentId: parentID });
	if (results.length == 1) {
		let permisions = _.filter(results[0].permission, { 'collectionName': modelName });
		if (permisions.length == 1) {
			if (permissionType == "view") {
				if (permisions[0].view == true)
					return true;
				else
					return false;
			}
			if (permissionType == "insertUpdate") {
				if (permisions[0].insertUpdate == true)
					return true;
				else
					return false;
			}
			if (permissionType == "delete") {
				if (permisions[0].delete == true)
					return true;
				else
					return false;
			}
			return false;
		} else
			return false;
	} else
		return false;
}
module.exports = { getPermission, collections };

