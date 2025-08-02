const { error } = require('console');
const {storage} = require('../middlewares/files-storage');
const File = require('../models/file');
const fs = require('fs');

// création de fichier
exports.createOneFile = (req, res, next) => {
    const file = new File({
        name: req.file.filename,
        description: req.body.imageDescription,
        fileUrl: `${req.protocol}://localhost:3000/uploads/${req.file.filename}`,
        userId: req.body.userId,
    });

    file.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré avec succès'}))
        .catch(error => res.status(400).json({ error }));
};


exports.getOneFile = (req, res, next) => {
    File.findOne({ _id: req.params.id })
        .then(file => res.status(200).json(file))
        .catch(error => res.status(500).json({ error }));
};

exports.getAllFiles = (req, res, next) => {
    File.find()
        .then(files => res.status(200).json(files))
        .catch(error => res.status(500).json({ error }));
};

exports.modifyOneFile = (req, res, next) => {

    const file = new File({
        name: req.file.filename,
        description: req.body.imageDescription,
        fileUrl: `${req.protocol}://localhost:3000/uploads/${req.file.filename}`,
        userId: req.body.userId,
    });

    File.findOne({ _id: req.params.id })
        .then((thing) => {
            if(file.userId !== thing.userId) {
                File.updateOne({ _id: req.params.id }, { ...file, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteOneFile = (req, res, next) => {
    File.findOne({ _id: req.body.id })
        .then(file => {
            const filename = file.imageUrl.split('/uploads/')[1];
            fs.unlink(`uploads/${filename}`, () => {
                File.deleteOne({ _id: req.body.id })
                    .then(() => res.status(200).json({ message: 'File deleted successfully' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
    .catch(error => {
        res.status(500).json({ error });
    });
};
