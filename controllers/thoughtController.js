const { User, Thought } = require('../models');

module.exports = {
    // /api/thoughts/ -- gets all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find()
                .select('-__v');
            res.json(thoughts)
        } catch (err) {
            res.status(500).json(err)
        }
    },

    // /api/thoughts -- creates a new thought
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);

            await User.findOneAndUpdate(
                { username: req.body.username },
                { $push: { thoughts: thought._id } },
                { new: true }
            );

            res.json(thought)
        } catch (err) {
            res.status(500).json(err)
        }
    },

    // /api/thoughts/:thoughtId -- gets thought by id
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
                .select('-__v')

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' })
            }

            res.json(thought)

        } catch (err) {
            res.status(500).json(err)
        }
    },

    // /api/thoughts/:thoughtId -- update thought by id
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { new: true }
            )

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that id' })
            }

            res.json(thought)

        } catch (err) {
            res.status(500).json(err)
        }
    },

    // api/thoughts/thought:Id -- delete thought by id
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId })

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' })
            }

            res.json({ message: 'Thought has been deleted.' })

        } catch (err) {
            res.status(500).json(err)
        }
    },

    // /api/thoughts/:thoughtId/reactions -- create a reaction to a thought
    async addReaction(req, res) {
        try {
            const { reactionBody, username } = req.body;
            const thoughtId = req.params.thoughtId;

            // add the reaction into the reaction array of the thought object
            const updatedThought = await Thought.findByIdAndUpdate(
                thoughtId,
                { $push: { reactions: { reactionBody, username } } },
                { runValidators: true, new: true }
            );

            if (!updatedThought) {
                return res.status(404).json({ message: 'Thought not found' });
            }

            res.json({ message: 'Reaction created successfully', updatedThought });

        } catch (err) {
            res.status(500).json(err)
        }
    },
    
    // api/thoughts/:thoughtId/reactions -- delete a reaction to a thought
    async deleteReaction(req, res) {
        try {
            const { thoughtId, reactionId } = req.params;

            // remove the reaction from the reactions array in the thought object
            const updatedThought = await Thought.findByIdAndUpdate(
                thoughtId,
                { $pull: { reactions: { _id: reactionId } } },
                { new: true }
            );

            if (!updatedThought) {
                return res.status(404).json({ message: 'Thought not found' });
            }

            res.json({ message: 'Reaction deleted successfully', updatedThought });
        } catch (err) {
            res.status(500).json(err)
        }
    }
}