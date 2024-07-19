const { User, Thought } = require("../models");

module.exports = {
  async getAllUsers(req, res) {
    try {
      const result = await User.find().populate("thoughts").populate("friends");
      res.json(result);
    } catch {
      res.status(500).json("failed");
    }
  },

  async getUserById(req, res) {
    try {
      const result = await User.findById(req.params.userId)
        .populate("thoughts")
        .populate("friends");

      if (!result) {
        return res.status(404).json({ message: "No user with that id" });
      }

      res.json(result);
    } catch {
      res.status(500).json("failed");
    }
  },

  async addUser(req, res) {
    try {
      const result = await User.create(req.body);

      if (!result) {
        return res.status(404).json({ message: "Failed to post user" });
      }

      res.json(result);
    } catch {
      res.status(500).json("failed");
    }
  },

  async updateUser(req, res) {
    try {
      const result = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!result) {
        return res.status(404).json({ message: "Failed to update user" });
      }

      res.json(result);
    } catch {
      res.status(500).json("failed");
    }
  },

  async deleteUser(req, res) {
    try {
      const result = await User.findOneAndDelete({ _id: req.params.userId });

      if (!result) {
        return res.status(404).json({ message: "Failed to delete user" });
      }

      await Thought.deleteMany({ username: result.username });

      res.json("User deleted!");
    } catch {
      res.status(500).json("failed");
    }
  },

  async addFriend(req, res) {
    try {
      const result = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $push: { friends: req.params.friendId } },
        { new: true }
      ).populate("friends");

      if (!result) {
        return res.status(404).json({ message: "No user found with that ID" });
      }

      res.json(result);
    } catch {
      res.status(500).json("failed");
    }
  },

  async deleteFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      ).populate("friends");

      if (!user) {
        return res.status(404).json({ message: "No user found with that ID" });
      }

      res.json(result);
    } catch {
      res.status(500).json("failed");
    }
  },
};
