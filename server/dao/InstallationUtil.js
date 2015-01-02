/**
 * Created by Umesh on 27-12-2014.
 */


// Create nutrilife db
// use nutrilife;

// Create nutrilife user
db.createUser({user:"nutrilifeuser",pwd:"nutrilifeuser",roles:["readWrite"]});

// Create Collections
db.createCollection("Admin_Users",{autoIndexId:true});
db.createCollection("Admin_Email",{autoIndexId:true});
db.createCollection("Admin_Site_Mgmt",{autoIndexId:true});
db.createCollection("Consultation",{autoIndexId:true});
db.createCollection("Customer",{autoIndexId:true});
db.createCollection("Diet_Plan",{autoIndexId:true});


// Create Super Admin user
db.Admin_Users.insert(
{ name:'Umesh Kumar', login_id:'umeshkumar.kumar@gmail.com',
    is_suspended:false, role:'Super_Admin', createdTime:new Date(),
    createdBy:'System', updatedTime:new Date(), updatedBy:'System'
});
