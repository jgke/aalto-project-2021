import router from "../router";
import { Request, Response } from "express";
import { IEdge } from "../../domain/IEdge";
import { db } from "../../dbConfigs";

router.route("/edge/delete")
  .post( async (req: Request, res: Response) => {
    try {
      const body = req.body
      if(!body.target || !body.source) {
        res.status(400)
      } else {
        const q = await db
          .query(
            "DELETE FROM edge WHERE source_id = $1 AND target_id = $2", [body.source, body.target]
          )
          .then( () => res.status(200))
          .catch( (e: Error) => console.log(e) )
      }
    }
    catch { (e:Error) => console.log(e) }
  })

router.route("/edge")
  .get(async (req: Request, res: Response) => {
    const q = await db.query("SELECT * FROM edge", []);

    res.json(q.rows);
  })
  .post(async (req: Request, res: Response) => {
    console.log("Receiving edge...");
    const text: IEdge = req.body; //Might have to parse this
    try {
      const q = await db.query(
        "INSERT INTO edge (source_id, target_id) VALUES ($1, $2)",
        [text.source_id, text.target_id]
      );
      res.status(200).json(q);
    }
    catch { (e: Error) => (
      console.log(e)
    )}
  })
  .put((req: Request, res: Response) => {
    res.status(501).json({ message: "Not implemented" });
  })
  .delete(async (req: Request, res: Response) => {
    res.status(501).json({ message: "Not implemented" });
  });

export default router;
