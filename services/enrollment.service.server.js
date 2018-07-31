module.exports = function (app) {
    app.post('/api/student/:sid/section/:kid', enrollStudentInSection);
    app.get('/api/student/:sid/section', findSectionsForStudent);
    app.delete('/api/student/:sid/section/:kid', unenrollStudentInSection);
    app.get('/api/student/:sid/course/:courseId/section/:kid', hasEnrollment);

    var sectionModel = require('../models/section/section.model.server');
    var enrollmentModel = require('../models/enrollment/enrollment.model.server');

    function enrollStudentInSection(req, res) {
        const curUser = req.session.currentUser;
        if (curUser) {
            const sectionId = req.params.kid;
            const enrollment = {
                student: curUser._id,
                section: sectionId,
                courseId: ''
            };

            sectionModel.findSectionById(sectionId)
                .then(
                    section => {
                        if (section.seats <= 0) {
                            res.json({error: 'No more space'});
                        } else {
                            console.log(section);
                            enrollment.courseId = section.courseId;
                            sectionModel
                                .decrementSectionSeats(sectionId)
                                .then(function () {
                                    return enrollmentModel
                                        .enrollStudentInSection(enrollment)
                                })
                                .then(function (enrollment) {
                                    res.json(enrollment);
                                });
                        }
                    })
        } else {
            res.json({error: 'Please log in'});
        }


    }

    function findSectionsForStudent(req, res) {
        const curUser = req.session.currentUser;
        if (curUser) {
            const studentId = req.params.sid;
            enrollmentModel
                .findSectionsForStudent(studentId)
                .then(function (enrollments) {
                    res.json(enrollments);
                });
        } else {
            res.json({error: 'Please log in'});
        }


    }

    function unenrollStudentInSection(req, res) {
        const curUser = req.session.currentUser;
        if (curUser) {
            const sectionId = req.params.kid;
            const enrollment = {
                student: curUser._id,
                section: sectionId
            };
            enrollmentModel.unenrollStudentInSection(enrollment)
                .then(() => sectionModel.incrementSectionSeats(sectionId)
                    .then(() => res.json({delete: 'un-enroll student from the section successfully'})))
        } else {
            res.json({error: 'Please log in'});
        }
    }

    function hasEnrollment(req, res) {
        const sectionId = req.params.kid;
        const studentId = req.params.sid;
        const courseId = req.params.courseId;
        const enrollment = {
            student: studentId,
            section: sectionId
        };
        enrollmentModel.hasEnrollmented(courseId)
            .then(results => {
                res.json(results);
            });

    }
}
