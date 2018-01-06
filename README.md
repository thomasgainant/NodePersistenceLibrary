# NodePersistenceLibrary
## Lightweight Node.js library inspired by Java Hibernate which allows JS objects to be persisted in a database - ©Thomas Gainant

Aimed to be usable by a very basic Node.JS environment (ECMA script 2015 compliant). Only MongoDB is supported for the moment but more DBMS must be supported in the future (especially MySQL and Postgre).

Current code is inside the npl.js script, which contains the main class and also an example (a custom class instancing) at the end of this script. The mapping of this class is inside the /mapping folder.

You can see that this example create an instance from a custom mapped class, changes one of its attributes after a few seconds, revert this attribute back and then destroys this instance.

If you check your database, you will see that this instance is saved in the database and the changes on its attributes are all saved on the database as they come by. The instance can also be deleted from the database by using the destroy() function. A simple set to null must work to do the same in the future.

You can also check that non mapped attribute won't be saved in the database, allowing to select what data should be stored in the database.

This saves a lot of time: you only need to map a custom class, instantiate it and call the persist() function. NPL then handles everything changes and saves it to you database.
