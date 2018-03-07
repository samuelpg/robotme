/*
DICTIONARY OF PREFIX
slu = slug, ID for urls
dte = date, Date of last modification
nme = name, name of the projects
aut = author, name of the author
tag = tag, tag for a project
var = variables, variables for a project (duh)
*/

CREATE TABLE IF NOT EXISTS projects (
    slu_projects VARCHAR(50) NOT NULL,
    dte_projects VARCHAR(50) NOT NULL,
    nme_projects VARCHAR(50) NOT NULL,
    aut_projects VARCHAR(50) NOT NULL,
    tag_projects VARCHAR(50) NOT NULL,
    PRIMARY KEY (slu_projects)
);

CREATE TABLE IF NOT EXISTS variables (
    slu_projects VARCHAR(50) NOT NULL,
    var_variables TEXT NOT NULL,
    FOREIGN KEY (slu_projects) REFERENCES projects (slu_projects)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    PRIMARY KEY (slu_projects)
);
