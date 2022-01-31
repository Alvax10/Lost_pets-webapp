export async function checkBody(req, res, next) {
    //check if req contains a body
    if (req.body) {
      next();
    } else {
      res.status(401).send("Missing body");
    }
}