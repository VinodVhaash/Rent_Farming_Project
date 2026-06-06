-- ═══════════════════════════════════════════════════════════════
-- Rent Farming – Database Initialization Script (MS SQL Server)
-- ═══════════════════════════════════════════════════════════════

-- Create database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'RentFarmingDB')
BEGIN
    CREATE DATABASE RentFarmingDB;
END
GO

USE RentFarmingDB;
GO

-- ─── Users Table ──────────────────────────────────────────────
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
    CREATE TABLE Users (
        id          INT IDENTITY(1,1) PRIMARY KEY,
        userId      NVARCHAR(50)  NOT NULL UNIQUE,
        firstName   NVARCHAR(100) NOT NULL,
        lastName    NVARCHAR(100) NOT NULL,
        address     NVARCHAR(500) NULL,
        surveyNumber NVARCHAR(100) NULL,        -- 7/12 Survey Number (for farmers)
        phone       NVARCHAR(15)  NOT NULL,
        password    NVARCHAR(255) NOT NULL,      -- bcrypt hash
        role        NVARCHAR(20)  NOT NULL DEFAULT 'farmer',  -- farmer | buyer | admin
        isVerified  BIT           NOT NULL DEFAULT 0,
        isBlocked   BIT           NOT NULL DEFAULT 0,
        createdAt   DATETIME2     NOT NULL DEFAULT GETDATE(),
        updatedAt   DATETIME2     NOT NULL DEFAULT GETDATE()
    );
END
GO

-- ─── Lands Table ──────────────────────────────────────────────
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Lands' AND xtype='U')
BEGIN
    CREATE TABLE Lands (
        id              INT IDENTITY(1,1) PRIMARY KEY,
        ownerId         INT           NOT NULL,
        area            DECIMAL(10,2) NOT NULL,
        landUnit        NVARCHAR(20)  NOT NULL DEFAULT 'acre',  -- acre | hectare
        crops           NVARCHAR(500) NULL,
        soilType        NVARCHAR(100) NULL,
        waterAvailability NVARCHAR(100) NULL,
        village         NVARCHAR(200) NULL,
        taluka          NVARCHAR(200) NULL,
        district        NVARCHAR(200) NULL,
        state           NVARCHAR(200) NULL,
        expectedRent    DECIMAL(12,2) NOT NULL,
        rentDuration    NVARCHAR(20)  NOT NULL DEFAULT 'yearly', -- monthly | yearly
        description     NVARCHAR(MAX) NULL,
        documentPath    NVARCHAR(500) NULL,     -- 7/12 document upload path
        approvalStatus  NVARCHAR(20)  NOT NULL DEFAULT 'pending', -- pending | approved | rejected
        rejectionReason NVARCHAR(500) NULL,
        createdAt       DATETIME2     NOT NULL DEFAULT GETDATE(),
        updatedAt       DATETIME2     NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Lands_Owner FOREIGN KEY (ownerId) REFERENCES Users(id) ON DELETE CASCADE
    );
END
GO

-- ─── Land Images Table ────────────────────────────────────────
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='LandImages' AND xtype='U')
BEGIN
    CREATE TABLE LandImages (
        id        INT IDENTITY(1,1) PRIMARY KEY,
        landId    INT           NOT NULL,
        imagePath NVARCHAR(500) NOT NULL,
        createdAt DATETIME2     NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_LandImages_Land FOREIGN KEY (landId) REFERENCES Lands(id) ON DELETE CASCADE
    );
END
GO

-- ─── OTP Verifications Table ──────────────────────────────────
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='OtpVerifications' AND xtype='U')
BEGIN
    CREATE TABLE OtpVerifications (
        id         INT IDENTITY(1,1) PRIMARY KEY,
        userId     NVARCHAR(50)  NOT NULL,
        otp        NVARCHAR(10)  NOT NULL,
        expiresAt  DATETIME2     NOT NULL,
        isVerified BIT           NOT NULL DEFAULT 0,
        createdAt  DATETIME2     NOT NULL DEFAULT GETDATE()
    );
END
GO

-- ─── Admin Actions Table ──────────────────────────────────────
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AdminActions' AND xtype='U')
BEGIN
    CREATE TABLE AdminActions (
        id         INT IDENTITY(1,1) PRIMARY KEY,
        adminId    INT           NOT NULL,
        actionType NVARCHAR(50)  NOT NULL,   -- approve | reject | block | unblock | delete
        listingId  INT           NULL,
        targetUserId INT         NULL,
        reason     NVARCHAR(500) NULL,
        createdAt  DATETIME2     NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_AdminActions_Admin FOREIGN KEY (adminId) REFERENCES Users(id)
    );
END
GO

-- ─── Saved Listings Table (Buyer bookmarks) ───────────────────
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SavedListings' AND xtype='U')
BEGIN
    CREATE TABLE SavedListings (
        id        INT IDENTITY(1,1) PRIMARY KEY,
        buyerId   INT NOT NULL,
        landId    INT NOT NULL,
        createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_SavedListings_Buyer FOREIGN KEY (buyerId) REFERENCES Users(id) ON DELETE CASCADE,
        CONSTRAINT FK_SavedListings_Land  FOREIGN KEY (landId)  REFERENCES Lands(id),
        CONSTRAINT UQ_SavedListings UNIQUE (buyerId, landId)
    );
END
GO

-- ─── Seed Default Admin User ──────────────────────────────────
-- Password: Admin@123  (bcrypt hash)
IF NOT EXISTS (SELECT 1 FROM Users WHERE userId = 'admin')
BEGIN
    INSERT INTO Users (userId, firstName, lastName, address, phone, password, role, isVerified)
    VALUES (
        'admin',
        'System',
        'Admin',
        'Platform Administration',
        '0000000000',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Admin@123
        'admin',
        1
    );
END
GO

PRINT '✅ RentFarmingDB initialized successfully.';
GO
