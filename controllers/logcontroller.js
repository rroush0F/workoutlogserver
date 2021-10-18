const Express = require('express');
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt")
const { WorkoutModel } = require('../models')


//New Workout
router.post('/new', validateJWT, async(req, res) => {
    const { description, definition, result } = req.body.workout;
    const { id } = req.user;
    const workoutEntry = {
        description,
        definition,
        result,
        owner: id
    }

    try {
        const newWorkout = await WorkoutModel.create(workoutEntry);
        res.status(200).json({ newWorkout });
    } catch (err) {
        res.status(500).json({ error: err });
    }

});

//All workouts
router.get("/all", validateJWT, async(req, res) => {
    let { id } = req.user;
    try {
        const userWorkout = await WorkoutModel.findAll({
            where: {
                owner: id
            }
        });
        res.status(200).json(userWorkout);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});


//Workout by ID
router.get("/all/:id", async (req, res) => {
    try {
      const locatedWorkout = await WorkoutModel.findAll({
        where: { id: req.params.WorkoutModel },
      });
      res
        .status(200)
        .json({ message: "Workout successfully retrieved", locatedPie });
    } catch (err) {
      res.status(500).json({ message: `Failed to retrieve workout: ${err}` });
    }
  });

  //Update by ID
  router.put("/:id", async (req, res) => {
    const { description, definition, results } =
      req.body;
    try {
      await WorkoutModel.update(
        { description, definition, results },
        { where: { id: req.params.id }, returning: true }
      ).then((result) => {
        res
          .status(200)
          .json({ message: "Workout successfully updated", updatedWorkout: result });
      });
    } catch (err) {
      res.status(500).json({ message: `Failed to update workout: ${err}` });
    }
  });

  //Delete by ID
  router.delete("/delete:id", async(req, res) => { 
    try{
        const query = {where: {
            id: req.params.id
        }}
        await WorkoutModel.destroy(query)
        res.status(200).json({
            message: "Workout has successfully been deleted"
        })
    } catch(err){
        res.status(500).json({
            message: "Workout failed to delete"
        })
    }
}) 

  module.exports = router;

