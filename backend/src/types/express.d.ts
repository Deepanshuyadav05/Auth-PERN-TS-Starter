// import express from 'express';
// import express from 'express' works, but you never use the name express. The import is only there to turn the file into a module. import "express"; says that more clearly

import "express";
//extends Express's Request so requireAuth can attach userI
declare module "express" {
    interface Request {          // ← re-declaring Express's Request
        userId? : string;   // ← adding a field
    }
}