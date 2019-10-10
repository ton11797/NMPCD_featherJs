import { Id, NullableId, Paginated, Params } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import mongoDB from '../../../DAL/mongo'
import postgresDB from '../../../DAL/postgres'
import neo4jDB from '../../../DAL/neo4j'
interface Data {}

interface ServiceOptions {}
interface ServiceMethods<T> {
  [key: string]: any;
  create (data: Partial<T> | Array<Partial<T>>, params?: Params): Promise<T | T[]>;
}
export class Reset implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  async create (data: Data, params?: Params): Promise<Data> {
    let Mdb = new mongoDB()
    await Mdb.connectDB()
    await Mdb.DB.db(this.app.get("mongodbDatabase")).dropDatabase()
    await Mdb.DB.db(this.app.get("mongodbDatabase")).collection("system").insertOne({})
    await Mdb.connectDB()
    let Pdb = new postgresDB()
    let client:any = await Pdb.open()
    await client.query('BEGIN')
    await client.query(`drop schema public cascade;`)
    await client.query(`create schema public;`)
    await client.query(`CREATE SEQUENCE public.users_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;`)
    await client.query(`CREATE SEQUENCE public.sequelize_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;`)
    await client.query(`CREATE TABLE public.sequelize
    (
        id integer NOT NULL DEFAULT nextval('sequelize_id_seq'::regclass),
        text character varying(255) COLLATE pg_catalog."default" NOT NULL,
        "createdAt" timestamp with time zone NOT NULL,
        "updatedAt" timestamp with time zone NOT NULL,
        CONSTRAINT sequelize_pkey PRIMARY KEY (id)
    );`)
    await client.query(`CREATE TABLE public.users
    (
        id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
        email character varying(255) COLLATE pg_catalog."default" NOT NULL,
        password character varying(255) COLLATE pg_catalog."default" NOT NULL,
        "createdAt" timestamp with time zone NOT NULL,
        "updatedAt" timestamp with time zone NOT NULL,
        CONSTRAINT users_pkey PRIMARY KEY (id),
        CONSTRAINT users_email_key UNIQUE (email)
    
    );`)
    await client.query('COMMIT')
    let neo = new neo4jDB()
    await neo.Session_commit(`MATCH (n) DETACH DELETE n`,{})
    return data;
  }

}
