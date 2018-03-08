/*
DICTIONARY OF PREFIX
slu = slug, ID for urls
dte = date, Date of last modification
nme = name, name of the projects
aut = author, name of the author
tag = tag, tag for a project
var = variables, variables for a project (duh)
pin = pin on the raspberry pi
typ = type of variable
*/

CREATE TABLE IF NOT EXISTS projects (
    slu_projects VARCHAR(50) NOT NULL,
    dte_projects VARCHAR(50) NOT NULL,
    nme_projects VARCHAR(50) NOT NULL,
    aut_projects VARCHAR(50) NOT NULL,
    tag_projects VARCHAR(50) NOT NULL,
    PRIMARY KEY (slu_projects)
);

CREATE TABLE IF NOT EXISTS variable (
    key_variable INTEGER NOT NULL,
    slu_projects VARCHAR(50) NOT NULL,
    nme_variable VARCHAR(50) NOT NULL,
    pin_variable INTEGER NOT NULL,
    tpe_variable VARCHAR(50) NOT NULL,
    FOREIGN KEY (slu_projects) REFERENCES projects (slu_projects)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    PRIMARY KEY (key_variable)
);