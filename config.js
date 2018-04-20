'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://bryan-mlab:Djxon2315@ds147659.mlab.com:47659/thinkful-blog-db';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/LocalBlogPostsDb';
exports.PORT = process.env.PORT || 8080;
