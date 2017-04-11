SELECT users.id,
    users.email,
    given_name as "givenName", 
    family_name as "familyName",
    email,
    date_email_verified as "dateEmailVerified";
    array_agg(roles.name) as roles,
  FROM users
  INNER JOIN user_roles ON users.id = user_roles.user_id
	INNER JOIN roles ON user_roles.role_id = roles.id
  WHERE users.email = $1
  GROUP BY users.email;
