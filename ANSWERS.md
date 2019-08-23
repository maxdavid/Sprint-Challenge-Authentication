# Self-Study Questions

1. What is the purpose of using sessions?

The purpose of using sessions is to allow user logins to persist. This way the user does not have to login every time they revisit.

2. What does bcrypt do to help us store passwords in a secure manner.

bcrypt allows us to hash passwords. This means we can check passwords and store them in our database without revealing to the database what the password itself really is.

3. What does bcrypt do to slow down attackers?

bcrypt allows us to hash passwords multiple times through rounds. The process takes time, making brute-force attacks those hashes much more difficult.

4. What are the three parts of the JSON Web Token?

The header, the payload, and the signature
