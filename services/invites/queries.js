'use strict';

module.exports = {
  create: `
    WITH last_invite AS (
      INSERT INTO invites (email, token, created_by_id) VALUES ($1, $2, $3) RETURNING id
    ), last_roles AS (
      INSERT INTO invite_roles(role_id, invite_id) (SELECT unnest($4::int[]), id FROM last_invite)
    )

    SELECT id FROM last_invite;
  `,

  find: `
    SELECT
        invites.id,
        invites.email,
        array(SELECT name FROM invite_roles LEFT OUTER JOIN roles ON invite_roles.role_id = roles.id WHERE invite_roles.invite_id = invites.id) as roles,
        users.email as "createdByEmail"
      FROM invites
      INNER JOIN users ON users.id = invites.created_by_id 
      LIMIT 20
      OFFSET $1;
    `,

  findByTokenAndEmail: `
    SELECT id, email, token, date_consumed AS "dateConsumed" FROM invites WHERE token = $1 AND email = $2 LIMIT 1;
  `,

  findByEmail: `
    SELECT id, email, token, date_consumed AS "dateConsumed",
      array(SELECT id FROM invite_roles LEFT OUTER JOIN roles ON invite_roles.role_id = roles.id WHERE invite_roles.invite_id = invites.id) as roles
    FROM invites WHERE email = $1 LIMIT 1;
  `,

  findById: `
    SELECT users.email, array_agg(roles.name) as roles
      FROM users, user_roles, roles
      WHERE users.id = user_roles.user_id
      AND user_roles.role_id = roles.id
      AND users.id = $1
      GROUP BY users.email;
    `,

  getAll: `
    SELECT
        invites.id,
        invites.email,
        array(SELECT id FROM invite_roles LEFT OUTER JOIN roles ON invite_roles.role_id = roles.id WHERE invite_roles.invite_id = invites.id) as roles,
        users.email as createdByEmail
      FROM invites
      INNER JOIN users ON users.id = invites.created_by_id; 
    `,
};