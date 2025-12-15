# File Storage System - Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         APPLICATION LAYER                            │
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │   Book Editor    │  │   Profile Page   │  │   Any Component  │ │
│  │   Component      │  │                  │  │                  │ │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘ │
│           │                     │                      │           │
└───────────┼─────────────────────┼──────────────────────┼───────────┘
            │                     │                      │
            └─────────────────────┴──────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      UI COMPONENT LAYER                              │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              FileUpload Component                             │  │
│  │  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐     │  │
│  │  │ Drag & Drop  │  │ Image Preview │  │ Error Display│     │  │
│  │  └──────────────┘  └───────────────┘  └──────────────┘     │  │
│  └────────────────────────────┬─────────────────────────────────┘  │
│                                │                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │           useFileUpload Hook (Optional)                      │  │
│  │  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐     │  │
│  │  │ State Mgmt   │  │ Progress      │  │ Error Handling│    │  │
│  │  └──────────────┘  └───────────────┘  └──────────────┘     │  │
│  └────────────────────────────┬─────────────────────────────────┘  │
└───────────────────────────────┼─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                            │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                   Main API Functions                          │  │
│  │                                                                │  │
│  │    uploadFile()  │  deleteFile()  │  getSignedUrl()          │  │
│  └────────────────────────────┬─────────────────────────────────┘  │
│                                │                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Storage Provider Factory                         │  │
│  │              (Factory Pattern)                                │  │
│  │                                                                │  │
│  │    ┌─────────────────────────────────────────┐                │  │
│  │    │  Reads: NEXT_PUBLIC_STORAGE_PROVIDER    │                │  │
│  │    │  Creates: Appropriate Provider Instance │                │  │
│  │    └─────────────────────────────────────────┘                │  │
│  └────────────────────────────┬─────────────────────────────────┘  │
│                                │                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Utility Functions                                │  │
│  │                                                                │  │
│  │  validateFile() │ generateUniqueName() │ sanitizeFileName()  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└───────────────────────────────┼─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   INTERFACE / CONTRACT LAYER                         │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              IStorageProvider Interface                       │  │
│  │                                                                │  │
│  │  + upload(file, options): Promise<UploadResult>               │  │
│  │  + delete(fileUrl): Promise<void>                             │  │
│  │  + getSignedUrl(url, expires): Promise<string>                │  │
│  │  + isConfigured(): boolean                                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└───────────────────────────────┼─────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
                ▼               ▼               ▼
┌───────────────────────────────────────────────────────────────────┐
│                    PROVIDER IMPLEMENTATIONS                        │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────┐ │
│  │  Supabase    │  │   Firebase   │  │  Cloudinary  │  │  S3  │ │
│  │   Storage    │  │   Storage    │  │              │  │      │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └───┬──┘ │
└─────────┼──────────────────┼──────────────────┼──────────────┼────┘
          │                  │                  │              │
          ▼                  ▼                  ▼              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     EXTERNAL STORAGE SERVICES                        │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────┐   │
│  │   Supabase   │  │   Firebase   │  │  Cloudinary  │  │ AWS  │   │
│  │     REST     │  │     REST     │  │     REST     │  │  S3  │   │
│  │     API      │  │     API      │  │     API      │  │ REST │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────┘   │
└─────────────────────────────────────────────────────────────────────┘


                    CONFIGURATION FLOW
                    ==================

    .env / Environment Variables
            │
            │  NEXT_PUBLIC_STORAGE_PROVIDER=supabase
            │  NEXT_PUBLIC_SUPABASE_URL=...
            │  NEXT_PUBLIC_SUPABASE_ANON_KEY=...
            │
            ▼
    StorageProviderFactory
            │
            │  Reads config
            │  Creates appropriate provider
            │
            ▼
    Selected Provider Instance
            │
            │  Validates configuration
            │  Ready for use
            │
            ▼
    Application Uses Provider
    (Without knowing which one!)


                    DATA FLOW - Upload
                    ==================

    User selects file
            │
            ▼
    FileUpload Component
            │
            │  Drag & drop or click
            │
            ▼
    Validation (client-side)
            │
            │  Size, type, etc.
            │
            ▼
    uploadFile() function
            │
            │  Gets active provider
            │
            ▼
    Provider.upload()
            │
            │  Supabase REST API
            │  Firebase REST API
            │  Cloudinary API
            │  S3 API
            │
            ▼
    External Storage Service
            │
            │  Stores file
            │  Returns URL
            │
            ▼
    UploadResult
            │
            │  { url, fileName, size, mimeType }
            │
            ▼
    Component receives URL
            │
            │  Updates form/state
            │  Shows preview
            │
            ▼
    URL saved to database


                    SOLID PRINCIPLES
                    ================

    ┌─────────────────────────────────────────────────┐
    │  Single Responsibility Principle (SRP)          │
    │  ─────────────────────────────────────          │
    │  • Providers: Only handle their storage         │
    │  • Validation: Separate utility functions       │
    │  • UI: Separate from business logic             │
    └─────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────┐
    │  Open/Closed Principle (OCP)                    │
    │  ───────────────────────────                    │
    │  • Add new providers without changing existing  │
    │  • Extend IStorageProvider interface            │
    └─────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────┐
    │  Liskov Substitution Principle (LSP)            │
    │  ────────────────────────────────               │
    │  • All providers are interchangeable            │
    │  • Code works with any provider                 │
    └─────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────┐
    │  Interface Segregation Principle (ISP)          │
    │  ──────────────────────────────────             │
    │  • Minimal required methods                     │
    │  • Optional methods are truly optional          │
    └─────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────┐
    │  Dependency Inversion Principle (DIP)           │
    │  ─────────────────────────────────              │
    │  • Depend on IStorageProvider interface         │
    │  • Not on concrete implementations              │
    │  • Factory creates the right provider           │
    └─────────────────────────────────────────────────┘
```
