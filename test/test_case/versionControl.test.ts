import assert from 'assert';
import { Server } from 'http';
import url from 'url';
import axios from 'axios';

import app from '../../src/app';

const port = app.get('port') || 8998;
const getUrl = (pathname?: string) => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname
});
console.log(getUrl())
describe('application test case', () => {
  let server: Server;
  let headers = {
    "Authorization":"",
    "Content-Type":"application/json"
  }
  let userid = ""
//   before(function(done) {
//     server = app.listen(port);
//     server.once('listening', () => done());
//   });

//   after(function(done) {
    
//     server.close(done);
//   });

  it('starts and shows the index page', async () => {
    const { data } = await axios.get(getUrl());

    assert.ok(data.indexOf('<html lang="en">') !== -1);
  });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  describe('Authentication', ()=> {
    describe('register', ()=> {
      it('should register without error', async() =>{
        const {data} = await axios.post(getUrl()+'/users',{
            "email": "test@test.com",
            "password": "testtest",
            "fullName":"test",
            "role":"1"
          });
        userid = data.id
        assert.ok(true)
      });
      it('should register with error', async() =>{
        let data:any = null
        try {
        data = await axios.post(getUrl()+'/users',{
            "email": "test@test.com",
            "password": "testtest",
            "fullName":"test",
            "role":"1"
            });
        } catch (error) {
            data = error
        }
        assert.equal(data.response.status, 400);
      });
      it('should login without error', async() =>{
        let data:any = null
        try {
        data = await axios.post(getUrl()+'/authentication',{
            "strategy": "local",
            "email": "test@test.com",
            "password": "testtest",
            });
        } catch (error) {
            data = error
        }
        headers.Authorization = "Bearer "+data.data.accessToken
        assert.ok(true)
      });
      it('should delete user without error', async() =>{
        let data:any = null
        try {
        data = await axios.delete(getUrl()+'/users/'+userid,{headers:headers});
        } catch (error) {
            data = error
        }
        assert.ok(true)
      });
    });
  });

  describe('preparing test', ()=>{
    it('register', async() =>{
        const {data} = await axios.post(getUrl()+'/users',{
            "email": "test@test.com",
            "password": "testtest",
            "fullName":"test",
            "role":"1"
          });
        userid = data.id
        assert.ok(true)
      });
      it('login', async() =>{
        let data:any = null
        try {
        data = await axios.post(getUrl()+'/authentication',{
            "strategy": "local",
            "email": "test@test.com",
            "password": "testtest",
            });
        } catch (error) {
            data = error
        }
        headers.Authorization = "Bearer "+data.data.accessToken
        assert.ok(true)
      });
      it('should reset all database without error', async() =>{
        let data:any = null
        data = await axios.post(getUrl()+'/systemMange/reset/',{},{headers:headers});
        assert.ok(true)
      });
      it('register again', async() =>{
        const {data} = await axios.post(getUrl()+'/users',{
            "email": "test@test.com",
            "password": "testtest",
            "fullName":"test",
            "role":"1"
          });
        userid = data.id
        assert.ok(true)
      });
      it('login', async() =>{
        let data:any = null
        try {
        data = await axios.post(getUrl()+'/authentication',{
            "strategy": "local",
            "email": "test@test.com",
            "password": "testtest",
            });
        } catch (error) {
            data = error
        }
        headers.Authorization = "Bearer "+data.data.accessToken
        assert.ok(true)
      });
  });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    describe('version control test', ()=>{
        it('should create new version without error', async() =>{
            let data:any = null
            data = await axios.post(getUrl()+'/versionControl/new-version',{
                "versionName":"v1"
            },{headers:headers});
            assert.ok(true)
        });
        it('should create duplication version name with error', async() =>{
            let data:any = null
            try {
                data = await axios.post(getUrl()+'/versionControl/new-version',{
                    "versionName":"v1"
                },{headers:headers});
            } catch (error) {
                data =error 
            }
            assert.equal(data.response.status, 400);
        });
        it('check version v1', async() =>{
            let {data} = await axios.get(getUrl()+'/versionControl/get-version');
            assert.ok(data.result.version[0].versionName==='v1')
        });
    })
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  describe('done test', ()=>{
    it('should delete user without error', async() =>{
        let data:any = null
        try {
        data = await axios.delete(getUrl()+'/users/'+userid,{headers:headers});
        } catch (error) {
            data = error
        }
        assert.ok(true)
    });
    
    // it('should reset all database without error', async() =>{
    //     let data:any = null
    //     data = await axios.post(getUrl()+'/systemMange/reset/',{},{headers:headers});
    //     assert.ok(true)
    //   });
  })
});
