-- AlterTable
CREATE SEQUENCE email_verification_id_seq;
ALTER TABLE "Email_Verification" ALTER COLUMN "id" SET DEFAULT nextval('email_verification_id_seq');
ALTER SEQUENCE email_verification_id_seq OWNED BY "Email_Verification"."id";
