import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { Lucia, TimeSpan } from "lucia";

const client = new PrismaClient();

const adapter = new PrismaAdapter(client.session, client.user);

export const lucia = new Lucia(adapter, {
	sessionExpiresIn: new TimeSpan(2, "w"), // 2 weeks
    getSessionAttributes: (attributes) => {
		return {
			ipCountry: attributes.ip_country
		};
	},
	getUserAttributes: (attributes) => {
		return attributes
	},
    sessionCookie:{
        name: "session",
		expires: false, // session cookies have very long lifespan (2 years)
		attributes: {
			secure: true,
			sameSite: "strict",
			domain: "example.com"
		}

    }

});


declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseSessionAttributes: DatabaseSessionAttributes;
        DatabaseUserAttributes: DatabaseUserAttributes;
	}
	interface DatabaseSessionAttributes {
		ip_country: string;
	}
    interface DatabaseUserAttributes {
        email: string;
        id:string
    }
    
}


// interface Session extends SessionAttributes {
// 	id: string;
// 	userId: string;
// 	expiresAt: Date;
// 	fresh: boolean;
// }