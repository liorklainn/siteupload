/**
 * Created by Lior Klain on 12/14/2016.
 */

//sitesCREATE TABLE `sites` (
//    `id` int(11) NOT NULL AUTO_INCREMENT,
//    `uuid` varchar(100) NOT NULL,
//    `virtual_path` varchar(500) NOT NULL,
//    `pysical_path` varchar(500) NOT NULL,
//    `owner_email` varchar(255) NOT NULL,
//    `create_date` datetime NOT NULL,
//    `due_date` datetime NOT NULL,
//    PRIMARY KEY (`id`),
//    KEY `uuid_index` (`uuid`),
//    KEY `email_index` (`owner_email`)
//) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=latin1;
//SELECT * FROM TestDB.persistent_logins;

var Sequelize = require('sequelize');
var sequelize = new Sequelize('SiteUploadDB', 'lior', 'q1w2e3r4', {
    host: 'mysqltest.cwjtaiu3wfr5.us-east-1.rds.amazonaws.com',
    port: 3306,
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
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