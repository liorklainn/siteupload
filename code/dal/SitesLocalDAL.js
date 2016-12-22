/**
 * Created by Lior Klain on 12/14/2016.
 */

var Sequelize = require('sequelize');
var sequelize = new Sequelize('SiteUploadDB', 'lior', 'q1w2e3r4', {
    dialect: 'sqlite',
    storage: 'localdb/SiteUploadDB.sqlite',
});

var sitesModel = sequelize.define('sites',{
    uuid: {
        type: Sequelize.STRING,
        field: 'uuid',
    },
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        autoIncrement: true,
        primaryKey: true
    },

    dueDate: {
        type: Sequelize.DATE,
        field: 'due_date'
    },

    createDate:{
        type: Sequelize.DATE,
        field: 'create_date'
    },

    physicalPath:{
        type: Sequelize.STRING,
        field: 'pysical_path'
    },

    virtualPath: {
        type: Sequelize.STRING,
        field: 'virtual_path'
    },

    ownerEmail: {
        type: Sequelize.STRING,
        field: 'owner_email'
    }
},
    {
        timestamps: false
    }
);

sequelize.sync();

module.exports = {
    saveSite: function (site) {
        //console.log('SitesDAL saving site  ' + JSON.stringify(site));

        sitesModel.create(site);
    },

    saveSiteOwner: function(siteUuid, ownerEmail) {
        //console.log('SitesDAL saving site owner ' + siteUuid + ' ' + ownerEmail);

        sitesModel.find({ where: { uuid: siteUuid } })
            .then( function (site) {
                console.log('site loaded ' + site.uuid);
                // Check if record exists in db
                if (site) {

                    //update site's owner in the db
                    site.updateAttributes({
                            ownerEmail: ownerEmail
                        })
                        .then(function () {
                            console.log('save ownerEmail success ' + ownerEmail);
                        })
                        .error(function (err) {
                                console.log('save ownerEmail failed ' + err);
                            }
                        );
                }
            })

    },

    getAll: function() {
        return sitesModel.findAndCountAll();
    }
}