var mongoose = require('mongoose');
var enrollmentSchema = require('./enrollment.schema.server');
var enrollmentModel = mongoose.model(
    'EnrollmentModel',
    enrollmentSchema
);

function enrollStudentInSection(enrollment) {
    return enrollmentModel.create(enrollment);
}

function findSectionsForStudent(studentId) {
    return enrollmentModel
        .find({student: studentId})
        .populate('section')
        .exec();
}

function unenrollStudentInSection (enrollment) {
    return enrollmentModel.remove(enrollment)
}

function hasEnrollmented (courseId) {
    return enrollmentModel.find({courseId: courseId});
}

function deleteEnrollmnetForUser (userId) {
    return enrollmentModel.remove({student: userId});
}

module.exports = {
    enrollStudentInSection: enrollStudentInSection,
    findSectionsForStudent: findSectionsForStudent,
    unenrollStudentInSection: unenrollStudentInSection,
    hasEnrollmented: hasEnrollmented,
    deleteEnrollmnetForUser: deleteEnrollmnetForUser
};