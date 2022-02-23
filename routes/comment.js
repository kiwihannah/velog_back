const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/commentController");
  
/** schema 생성
 * @swagger
 *     components:
 *         schemas:
 *             Comments:
 *                 type: object
 *                 required:
 *                     - commentBody
 *                     - isDeleted
 *                     - replyCnt
 *                 properties:
 *                     id:
 *                         type: integer
 *                         description: auto-generated id on the Comments table.
 *                     parentsId:
 *                         type: integer
 *                         description: id for chlid commnets
 *                     commentBody:
 *                         type: string
 *                         description: comment content
 *                     isDeleted:
 *                         type: string
 *                         description: status of comment / 'Y' or 'N'
 *                     replyCnt:
 *                         type: integer
 *                         description: re-reply count
 */

/**
 * @swagger
 * /api/post/1/comment/0:
 *   comments:
 *     description: write comments
 *     tags: [Comments]
 *     requestParams:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comments'
 *     responses:
 *       "201":
 *         description: "successful operation"
 */
router.post("/:postId/comment/:commentId", CommentController.create.comment); 
router.get("/:postId/comments", CommentController.get.commentsParents);
router.get("/:postId/comments/:commentId", CommentController.get.commentsChild);
router.patch('/:postId/comment/:commentId', CommentController.update.comment);
router.patch('/:postId/comment/:commentId/disabled', CommentController.delete.comment);

module.exports = router;