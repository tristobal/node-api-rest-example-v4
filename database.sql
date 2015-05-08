CREATE TABLE "user" (
    "id"  SERIAL ,
    "nickname" VARCHAR NOT NULL DEFAULT 'NULL' ,
    "email" VARCHAR NOT NULL DEFAULT 'NULL' ,
    "password" VARCHAR NOT NULL DEFAULT 'NULL' ,
    "notifications" BOOLEAN NOT NULL DEFAULT 'true' ,
    PRIMARY KEY ("id")
);

CREATE TABLE "task" (
    "id"  SERIAL ,
    "id_user" INTEGER ,
    "id_list" INTEGER ,
    "name" VARCHAR NOT NULL DEFAULT 'NULL' ,
    "notes" VARCHAR ,
    "lat" DOUBLE ,
    "long" DOUBLE ,
    "address" VARCHAR ,
    "visited" BOOLEAN NOT NULL DEFAULT 'false' ,
    PRIMARY KEY ("id")
);

CREATE TABLE "list" (
    "id"  SERIAL ,
    "id_user" INTEGER ,
    "name" VARCHAR NOT NULL DEFAULT 'NULL' ,
    PRIMARY KEY ("id")
);

CREATE TABLE "member" (
    "id_user" INTEGER ,
    "id_list" INTEGER ,
    PRIMARY KEY ("id_user", "id_list")
);

ALTER TABLE "task" ADD FOREIGN KEY ("id_user") REFERENCES "user" ("id");
ALTER TABLE "task" ADD FOREIGN KEY ("id_list") REFERENCES "list" ("id");
ALTER TABLE "list" ADD FOREIGN KEY ("id_user") REFERENCES "user" ("id");
ALTER TABLE "member" ADD FOREIGN KEY ("id_user") REFERENCES "user" ("id");
ALTER TABLE "member" ADD FOREIGN KEY ("id_list") REFERENCES "list" ("id");
