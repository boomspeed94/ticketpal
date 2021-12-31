CREATE TABLE IF NOT EXISTS Assets (
  "id" varchar(36) PRIMARY KEY,
  "name" varchar(100),
  "tokenId" integer NOT NULL,
  "imageUrl" text NOT NULL,
  "metaReference" text default '',
  "eventId" varchar(36) NOT NULL,
  "ownerAddress" varchar(100),
  "slotNo" numeric NOT NULL,
  "createAt" varchar(100),
  "lastSale" varchar(100),
  "availableForSale" boolean not null default false
);

CREATE TABLE IF NOT EXISTS Events (
  "id" varchar(36),
  "name" varchar(100),
  "path" varchar(128),
  "imageUrl" text default '',
  "creatorAddress" varchar(100),
  "metaReference" text default '',
  "createAt" varchar(100),
  "categories" text default '[]',
  "amountOfTickets" integer default 0,
  "pricePerTicket" real default 0.0,
  "location" text default '',
  "organizer" text default '',
  "description" text default '',
  "startAt" varchar(100),
  "endAt" varchar(100),
  "availableForSale" boolean not null default false,
  PRIMARY KEY ("creatorAddress", "path")
);

CREATE TABLE IF NOT EXISTS EventAssetList (
  "assetId" varchar(36),
  "eventId" varchar(36),
  PRIMARY KEY ("eventId", "assetId")
);

CREATE TABLE IF NOT EXISTS Contracts (
  "id" varchar(36),
  "address" varchar(100),
  "network" varchar(100),
  "name" varchar(100),
  "symbol" varchar(100),
  "description" varchar(4000),
  PRIMARY KEY ("address", "network")
);

CREATE TABLE IF NOT EXISTS Users (
  "id" varchar(36) PRIMARY KEY,
  "address" varchar(100),
  "name" varchar(50),
  "phone" varchar(12),
  "email" varchar(100),
  "avatarUrl" varchar(100),
  "birthday" varchar(100),
  "createAt" varchar(100),
  "sessionId" varchar(100)
);

CREATE TABLE IF NOT EXISTS UserWallets (
  "userId" varchar(36),
  "address" varchar(100),
  PRIMARY KEY ("userId", "address")
);

CREATE TABLE IF NOT EXISTS Transactions (
  "fromAddress" character varying(100),
  "toAddress" character varying(100),
  "priceICX" numeric,
  "slotNo" numeric,
  "eventName" character varying(1000),
  "tokenId" character varying(100),
  "txTime" timestamp without time zone,
  "blockNumber" numeric,
  "txHash" character varying(100),
  "blockHash" character varying(100),
  "txError" character varying(500),
  "type" character varying(20),
  "createAt" timestamp without time zone,
  PRIMARY KEY ("tokenId", "txHash")
);

CREATE TABLE IF NOT EXISTS Market (
  "tokenId" integer NOT NULL,
  "orderId" character varying(100),
  "priceICX" numeric,
  "ownerId" character varying(100),
  "createAt" timestamp without time zone,
  PRIMARY KEY ("tokenId", "orderId")
);


---------------------- Contracts data -------------------
INSERT INTO Contracts
  ("id", "address", "network", "name", "symbol", "description")
SELECT 'cb585883-003b-4308-89e5-3731e4a67f77', 'cx901c6b3846534c99863e6452cfd43e2fa271526b', 'ICON', 'Korean NFT', 'knft', 'test contract'
WHERE
  NOT EXISTS (
      SELECT "id" FROM Contracts WHERE "address" = 'cx901c6b3846534c99863e6452cfd43e2fa271526b'
  );
