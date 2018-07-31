module.exports = function (app) {

    app.post('/api/course/:courseId/section', createSection);
    app.get('/api/course/:courseId/section', findSectionsForCourse);
    app.put('/api/section/:sectionId', updateSection);
    app.delete('/api/section/:sectionId', deleteSection);
    app.get('/api/section/:sectionId', findSectionById);


    var sectionModel = require('../models/section/section.model.server');

    function findSectionsForCourse(req, res) {
        var courseId = req.params['courseId'];
        sectionModel
            .findSectionsForCourse(courseId)
            .then(function (sections) {
                res.json(sections);
            })
    }

    function createSection(req, res) {
        const section = req.body;
        sectionModel
            .createSection(section)
            .then(function (section) {
                res.json(section);
            })
    }

    function updateSection (req, res) {
        const section = req.body;
        sectionModel.updateSection(section)
            .then(results => res.json(results));
    }

    function deleteSection(req, res) {
        const sectionId = req.params['sectionId'];
        sectionModel.deleteSection(sectionId)
            .then(results => res.json(results));
    }

    function findSectionById(req, res) {
        var sectionId = req.params['sectionId'];
        sectionModel
            .findSectionById(sectionId)
            .then(function (sections) {
                res.json(sections);
            });

    }
};