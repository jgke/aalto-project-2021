import router from "../router";
import { Request, Response } from "express";
import { IEdge } from "../../domain/IEdge";
import { db } from "../../dbConfigs";

router.route("/edge/:source/:target")
  .delete(async(req: Request, res: Response) => {
    
      const source = req.params.source
      const target = req.params.target
       await db
        .query("DELETE FROM edge WHERE source_id = $1 AND target_id = $2", [source, target])
      res.status(200).json()
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
