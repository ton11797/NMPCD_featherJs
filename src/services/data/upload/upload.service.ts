// Initializes the `data/upload` service on path `/data/upload`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Upload } from './upload.class';
import hooks from './upload.hooks';
import path from 'path'
// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'data/upload': Upload & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  // Initialize our service with any options it requires
  const options = {
    paginate: app.get('paginate'),
    multi: true 
  };
  const multer = require('multer');
  const { authenticate } = require('@feathersjs/express');
  const storage = multer.diskStorage({
    destination: (_req:any, _file:any, cb:any) => cb(null, app.get('fileUploadPath')), // where the files are being stored
    filename: (_req:any, file:any, cb:any) => cb(null, `${Date.now()}-${_req.user.id}-${Math.floor(Math.random() * (9999 - 1111) + 1111)}-${file.originalname}`) // getting the file name
  });
  const upload = multer({
    storage,
    limits: {
      fieldSize: 1e+8, // Max field value size in bytes, here it's 100MB
      fileSize: 1e+8 //  The max file size in bytes, here it's 10MB
      // files: the number of files
      // READ MORE https://www.npmjs.com/package/multer#limits
    },
    fileFilter:(req:any,file:any,cb:any)=>{
      cb(null,allowedExtentions.includes(path.extname(file.originalname)))
    }
  });
  const allowedExtentions = ['.xls','.xlsx','.csv','.txt']
  console.log(authenticate('jwt'))
  app.use('/data/upload',
    authenticate('jwt'),
    upload.array('files'),
    (req:any,res:any,next)=>{
      const { method } = req;
      if (method === 'POST' || method === 'PATCH') {
        // I believe this middleware should only transfer
        // files to feathers and call next();
        // and the mapping of data to the model shape
        // should be in a hook.
        // this code is only for this demo.
        req.feathers.files = req.files; // transfer the received files to feathers
        // for transforming the request to the model shape
        const body = [];
        for (const file of req.files)
          body.push({
            description: req.body.description,
            orignalName: file.originalname,
            newNameWithPath: file.path,
            userId: req.user.id
          });
        req.body = method === 'POST' ? body : body[0];
        res.send(body)
      }
    }
  )

  // Get our initialized service so that we can register hooks
  const service = app.service('data/upload');
  // service.hooks(hook);
}

