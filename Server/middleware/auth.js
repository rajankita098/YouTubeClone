import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No or malformed token provided" });
          }
        const token = authHeader.split(" ")[1]; // Extract token from Authorization header
        if (!token) {
            return res.status(403).json({ message: "No token provided" });
        }

        // Verify the token using the correct secret
        let decodedData = jwt.verify(token, process.env.JWT_SECRET); // Ensure the secret is correctly referenced
        req.user = { id: decodedData?.id };
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(400).json({ message: "Invalid or expired token" });
    }
};

export default auth;
