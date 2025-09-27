import { 
  PrismaClient, 
  UserType, 
  VerificationStatus, 
  OnboardingStatus,
  ProductRequestStatus,
  PartnershipStatus,
  NotificationType,
  TrainingStatus,
  AlertType,
  AlertPriority
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data in reverse dependency order


  console.log('🗑️  Cleared existing data');

  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 12);

  // 1. Create Users (Vendors and Distributors)
  const vendorUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'vendor1@techcorp.com',
        passwordHash: hashedPassword,
        userType: UserType.vendor,
        firstName: 'John',
        lastName: 'Smith',
        companyName: 'TechCorp Solutions',
        phone: '+1-555-0101',
        isVerified: true,
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'vendor2@innovate.com',
        passwordHash: hashedPassword,
        userType: UserType.vendor,
        firstName: 'Sarah',
        lastName: 'Johnson',
        companyName: 'Innovate Industries',
        phone: '+1-555-0102',
        isVerified: true,
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'vendor3@globaltech.com',
        passwordHash: hashedPassword,
        userType: UserType.vendor,
        firstName: 'Michael',
        lastName: 'Chen',
        companyName: 'GlobalTech Enterprises',
        phone: '+1-555-0103',
        isVerified: false,
        isActive: true,
      },
    }),
  ]);

  const distributorUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'distributor1@fastdist.com',
        passwordHash: hashedPassword,
        userType: UserType.distributor,
        firstName: 'Emily',
        lastName: 'Rodriguez',
        companyName: 'FastDist Networks',
        phone: '+1-555-0201',
        isVerified: true,
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'distributor2@supplychain.com',
        passwordHash: hashedPassword,
        userType: UserType.distributor,
        firstName: 'David',
        lastName: 'Thompson',
        companyName: 'SupplyChain Pro',
        phone: '+1-555-0202',
        isVerified: true,
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'distributor3@logistics.com',
        passwordHash: hashedPassword,
        userType: UserType.distributor,
        firstName: 'Lisa',
        lastName: 'Wang',
        companyName: 'Logistics Excellence',
        phone: '+1-555-0203',
        isVerified: true,
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'distributor4@regionaldist.com',
        passwordHash: hashedPassword,
        userType: UserType.distributor,
        firstName: 'Robert',
        lastName: 'Miller',
        companyName: 'Regional Distribution',
        phone: '+1-555-0204',
        isVerified: false,
        isActive: true,
      },
    }),
  ]);

  // Admin user for system settings
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@citplatform.com',
      passwordHash: hashedPassword,
      userType: UserType.vendor, // Using vendor type for admin
      firstName: 'Admin',
      lastName: 'User',
      companyName: 'CIT Platform',
      phone: '+1-555-0000',
      isVerified: true,
      isActive: true,
    },
  });

  console.log('👥 Created users');

  // 2. Create Vendor Profiles
  const vendors = await Promise.all([
    prisma.vendor.create({
      data: {
        userId: vendorUsers[0].id,
        companyDescription: 'Leading provider of innovative software solutions for enterprise clients',
        businessLicense: 'BL-TECH-2024-001',
        taxId: 'TAX-987654321',
        address: '123 Innovation Drive, Tech Valley, CA 94043',
        website: 'https://techcorp.com',
        verificationStatus: VerificationStatus.verified,
      },
    }),
    prisma.vendor.create({
      data: {
        userId: vendorUsers[1].id,
        companyDescription: 'Manufacturing excellence in industrial automation and IoT devices',
        businessLicense: 'BL-INNO-2024-002',
        taxId: 'TAX-876543210',
        address: '456 Industrial Blvd, Manufacturing Hub, TX 75201',
        website: 'https://innovateindustries.com',
        verificationStatus: VerificationStatus.verified,
      },
    }),
    prisma.vendor.create({
      data: {
        userId: vendorUsers[2].id,
        companyDescription: 'Global technology solutions with focus on AI and machine learning',
        businessLicense: 'BL-GLOBAL-2024-003',
        taxId: 'TAX-765432109',
        address: '789 Tech Plaza, Silicon City, WA 98101',
        website: 'https://globaltech.com',
        verificationStatus: VerificationStatus.pending,
      },
    }),
  ]);

  console.log('🏢 Created vendor profiles');

  // 3. Create Distributor Profiles
  const distributors = await Promise.all([
    prisma.distributor.create({
      data: {
        userId: distributorUsers[0].id,
        experienceYears: 8,
        coverageAreas: 'North America, Western Europe',
        distributionChannels: 'Online, Retail, B2B Direct Sales',
        portfolioSize: 150,
        verificationStatus: VerificationStatus.verified,
        onboardingStatus: OnboardingStatus.completed,
      },
    }),
    prisma.distributor.create({
      data: {
        userId: distributorUsers[1].id,
        experienceYears: 12,
        coverageAreas: 'Asia-Pacific, Southeast Asia',
        distributionChannels: 'Wholesale, E-commerce, Partner Networks',
        portfolioSize: 200,
        verificationStatus: VerificationStatus.verified,
        onboardingStatus: OnboardingStatus.completed,
      },
    }),
    prisma.distributor.create({
      data: {
        userId: distributorUsers[2].id,
        experienceYears: 6,
        coverageAreas: 'Eastern Europe, Middle East',
        distributionChannels: 'Retail, Online Marketplaces',
        portfolioSize: 75,
        verificationStatus: VerificationStatus.verified,
        onboardingStatus: OnboardingStatus.in_progress,
      },
    }),
    prisma.distributor.create({
      data: {
        userId: distributorUsers[3].id,
        experienceYears: 3,
        coverageAreas: 'Latin America, South America',
        distributionChannels: 'Regional Retail, Local Partnerships',
        portfolioSize: 45,
        verificationStatus: VerificationStatus.pending,
        onboardingStatus: OnboardingStatus.not_started,
      },
    }),
  ]);

  console.log('📦 Created distributor profiles');

  // 4. Create Product Requests
  const productRequests = await Promise.all([
    prisma.productRequest.create({
      data: {
        vendorId: vendors[0].id,
        title: 'Enterprise CRM Software Distribution',
        productDescription: 'Comprehensive Customer Relationship Management software for enterprise clients. Features include lead management, sales pipeline, customer analytics, and integration capabilities.',
        productCategory: 'Software',
        targetMarket: 'Enterprise, Mid-market companies',
        commissionRate: 15.00,
        requirements: 'Experience with B2B software sales, technical support capabilities, minimum $100K annual sales target',
        status: ProductRequestStatus.open,
      },
    }),
    prisma.productRequest.create({
      data: {
        vendorId: vendors[0].id,
        title: 'AI-Powered Analytics Platform',
        productDescription: 'Advanced analytics platform using artificial intelligence for business intelligence and predictive analytics.',
        productCategory: 'Software',
        targetMarket: 'Data-driven enterprises, Analytics teams',
        commissionRate: 20.00,
        requirements: 'Technical background in data analytics, established client network in tech sector',
        status: ProductRequestStatus.matched,
      },
    }),
    prisma.productRequest.create({
      data: {
        vendorId: vendors[1].id,
        title: 'Industrial IoT Sensors',
        productDescription: 'High-precision IoT sensors for industrial monitoring, predictive maintenance, and operational efficiency.',
        productCategory: 'Hardware',
        targetMarket: 'Manufacturing, Industrial facilities',
        commissionRate: 12.50,
        requirements: 'Knowledge of industrial automation, established relationships with manufacturing companies',
        status: ProductRequestStatus.open,
      },
    }),
    prisma.productRequest.create({
      data: {
        vendorId: vendors[1].id,
        title: 'Smart Factory Automation Suite',
        productDescription: 'Complete automation solution for smart factories including robotics integration, workflow automation, and real-time monitoring systems.',
        productCategory: 'Hardware',
        targetMarket: 'Large manufacturing facilities, Industrial companies',
        commissionRate: 18.00,
        requirements: 'Deep understanding of industrial processes, experience with large-scale implementations',
        status: ProductRequestStatus.matched,
      },
    }),
    prisma.productRequest.create({
      data: {
        vendorId: vendors[2].id,
        title: 'Machine Learning Development Platform',
        productDescription: 'Cloud-based platform for developing, training, and deploying machine learning models at scale.',
        productCategory: 'Software',
        targetMarket: 'Tech companies, Data science teams, AI startups',
        commissionRate: 25.00,
        requirements: 'Strong technical background in AI/ML, connections in tech industry, ability to provide technical pre-sales support',
        status: ProductRequestStatus.open,
      },
    }),
  ]);

  console.log('📋 Created product requests');

  // 5. Create Contract Templates
  const contractTemplates = await Promise.all([
    prisma.contractTemplate.create({
      data: {
        vendorId: vendors[0].id,
        name: 'Standard Software Distribution Agreement',
        templateContent: `
DISTRIBUTION AGREEMENT

This Distribution Agreement ("Agreement") is entered into between TechCorp Solutions ("Vendor") and the Distributor.

1. APPOINTMENT: Vendor hereby appoints Distributor as a non-exclusive distributor for the Products in the Territory.

2. PRODUCTS: Software solutions including CRM and Analytics platforms as specified in Schedule A.

3. TERRITORY: As specified in the partnership agreement.

4. TERM: This Agreement shall commence on the Effective Date and continue for an initial term of 12 months.

5. PRICING AND PAYMENTS: Distributor commission rates as specified in individual product agreements.

6. OBLIGATIONS: 
   - Distributor shall use best efforts to promote and sell Products
   - Maintain adequate technical support capabilities
   - Comply with all applicable laws and regulations

7. CONFIDENTIALITY: Both parties agree to maintain confidentiality of proprietary information.

8. TERMINATION: Either party may terminate with 30 days written notice.
        `,
        isActive: true,
      },
    }),
    prisma.contractTemplate.create({
      data: {
        vendorId: vendors[1].id,
        name: 'Industrial Hardware Distribution Contract',
        templateContent: `
INDUSTRIAL DISTRIBUTION AGREEMENT

This Agreement governs the distribution of industrial IoT and automation products.

1. SCOPE: Distribution of IoT sensors, automation equipment, and related hardware.

2. EXCLUSIVE TERRITORY: Regional exclusivity as defined in partnership terms.

3. MINIMUM PERFORMANCE: Annual minimum sales targets apply.

4. TECHNICAL SUPPORT: Distributor must maintain certified technical staff.

5. WARRANTY: Products covered by manufacturer warranty, distributor provides first-level support.

6. MARKETING: Cooperative marketing programs available.

7. TRAINING: Mandatory training programs for distributor staff.
        `,
        isActive: true,
      },
    }),
  ]);

  console.log('📄 Created contract templates');

  // 6. Create Partnerships
  const partnerships = await Promise.all([
    prisma.partnership.create({
      data: {
        vendorId: vendors[0].id,
        distributorId: distributors[0].id,
        productRequestId: productRequests[1].id, // AI Analytics Platform
        status: PartnershipStatus.active,
        acceptedAt: new Date('2024-08-15'),
        contractSentAt: new Date('2024-08-16'),
        contractSignedAt: new Date('2024-08-20'),
        activatedAt: new Date('2024-08-21'),
      },
    }),
    prisma.partnership.create({
      data: {
        vendorId: vendors[1].id,
        distributorId: distributors[1].id,
        productRequestId: productRequests[3].id, // Smart Factory Suite
        status: PartnershipStatus.contract_signed,
        acceptedAt: new Date('2024-09-01'),
        contractSentAt: new Date('2024-09-02'),
        contractSignedAt: new Date('2024-09-05'),
      },
    }),
    prisma.partnership.create({
      data: {
        vendorId: vendors[0].id,
        distributorId: distributors[2].id,
        productRequestId: productRequests[0].id, // CRM Software
        status: PartnershipStatus.contract_sent,
        acceptedAt: new Date('2024-09-10'),
        contractSentAt: new Date('2024-09-12'),
      },
    }),
    prisma.partnership.create({
      data: {
        vendorId: vendors[1].id,
        distributorId: distributors[0].id,
        productRequestId: productRequests[2].id, // IoT Sensors
        status: PartnershipStatus.pending,
      },
    }),
  ]);

  console.log('🤝 Created partnerships');

  // 7. Create Contracts
  const contracts = await Promise.all([
    prisma.contract.create({
      data: {
        partnershipId: partnerships[0].id,
        contractTemplateId: contractTemplates[0].id,
        welcomeLinkToken: 'wlt_' + Math.random().toString(36).substring(2, 15),
        commissionRate: 20.00,
        termsAndConditions: 'Standard terms for AI Analytics Platform distribution with 20% commission rate, minimum annual sales target of $500K, exclusive territory rights for Western Europe.',
        servicesDescription: 'Distribution of AI-Powered Analytics Platform including technical support, customer training, and implementation services.',
        licenseDetails: 'Non-exclusive distribution license with right to resell and provide support services.',
        obligations: 'Maintain certified technical staff, provide first-level customer support, meet quarterly sales targets, participate in joint marketing activities.',
        isSigned: true,
        signedAt: new Date('2024-08-20'),
        signedByIp: '192.168.1.100',
        digitalSignature: 'DS_' + Math.random().toString(36).substring(2, 15),
        expiresAt: new Date('2025-08-20'),
      },
    }),
    prisma.contract.create({
      data: {
        partnershipId: partnerships[1].id,
        contractTemplateId: contractTemplates[1].id,
        welcomeLinkToken: 'wlt_' + Math.random().toString(36).substring(2, 15),
        commissionRate: 18.00,
        termsAndConditions: 'Industrial automation distribution agreement with 18% commission, minimum $1M annual target, Asia-Pacific territory.',
        servicesDescription: 'Distribution of Smart Factory Automation Suite including installation support, training, and maintenance services.',
        licenseDetails: 'Regional exclusive distribution license for Asia-Pacific market.',
        obligations: 'Maintain certified installation team, provide comprehensive customer training, meet annual sales targets, ensure compliance with industrial safety standards.',
        isSigned: true,
        signedAt: new Date('2024-09-05'),
        signedByIp: '192.168.1.101',
        digitalSignature: 'DS_' + Math.random().toString(36).substring(2, 15),
        expiresAt: new Date('2025-09-05'),
      },
    }),
    prisma.contract.create({
      data: {
        partnershipId: partnerships[2].id,
        contractTemplateId: contractTemplates[0].id,
        welcomeLinkToken: 'wlt_' + Math.random().toString(36).substring(2, 15),
        commissionRate: 15.00,
        termsAndConditions: 'CRM software distribution with 15% commission rate, Eastern Europe territory, minimum $300K annual target.',
        servicesDescription: 'Distribution of Enterprise CRM Software with implementation and support services.',
        licenseDetails: 'Non-exclusive distribution license for Eastern Europe region.',
        obligations: 'Provide customer implementation support, maintain technical certification, achieve quarterly milestones.',
        isSigned: false,
      },
    }),
  ]);

  console.log('📋 Created contracts');

  // 8. Create Training Modules
  const trainingModules = await Promise.all([
    prisma.trainingModule.create({
      data: {
        vendorId: vendors[0].id,
        title: 'CRM Software Fundamentals',
        description: 'Comprehensive training on CRM software features, implementation best practices, and customer onboarding processes.',
        contentUrl: 'https://training.techcorp.com/crm-fundamentals',
        orderSequence: 1,
        estimatedDuration: 180, // 3 hours
        isMandatory: true,
        isActive: true,
      },
    }),
    prisma.trainingModule.create({
      data: {
        vendorId: vendors[0].id,
        title: 'Advanced Analytics and Reporting',
        description: 'Deep dive into analytics features, custom report creation, and data visualization capabilities.',
        contentUrl: 'https://training.techcorp.com/advanced-analytics',
        orderSequence: 2,
        estimatedDuration: 240, // 4 hours
        isMandatory: true,
        isActive: true,
      },
    }),
    prisma.trainingModule.create({
      data: {
        vendorId: vendors[0].id,
        title: 'Sales Process and Customer Success',
        description: 'Best practices for selling software solutions, handling objections, and ensuring customer success.',
        contentUrl: 'https://training.techcorp.com/sales-process',
        orderSequence: 3,
        estimatedDuration: 120, // 2 hours
        isMandatory: false,
        isActive: true,
      },
    }),
    prisma.trainingModule.create({
      data: {
        vendorId: vendors[1].id,
        title: 'Industrial IoT Installation Guide',
        description: 'Technical training on IoT sensor installation, configuration, and troubleshooting in industrial environments.',
        contentUrl: 'https://training.innovate.com/iot-installation',
        orderSequence: 1,
        estimatedDuration: 300, // 5 hours
        isMandatory: true,
        isActive: true,
      },
    }),
    prisma.trainingModule.create({
      data: {
        vendorId: vendors[1].id,
        title: 'Factory Automation Systems',
        description: 'Comprehensive overview of automation systems, integration processes, and maintenance procedures.',
        contentUrl: 'https://training.innovate.com/automation-systems',
        orderSequence: 2,
        estimatedDuration: 360, // 6 hours
        isMandatory: true,
        isActive: true,
      },
    }),
  ]);

  console.log('🎓 Created training modules');

  // 9. Create Training Progress
  const trainingProgress = await Promise.all([
    // Distributor 1 progress on TechCorp modules
    prisma.trainingProgress.create({
      data: {
        distributorId: distributors[0].id,
        trainingModuleId: trainingModules[0].id,
        partnershipId: partnerships[0].id,
        status: TrainingStatus.completed,
        progressPercentage: 100,
        startedAt: new Date('2024-08-22'),
        completedAt: new Date('2024-08-22'),
        timeSpent: 180,
      },
    }),
    prisma.trainingProgress.create({
      data: {
        distributorId: distributors[0].id,
        trainingModuleId: trainingModules[1].id,
        partnershipId: partnerships[0].id,
        status: TrainingStatus.completed,
        progressPercentage: 100,
        startedAt: new Date('2024-08-23'),
        completedAt: new Date('2024-08-24'),
        timeSpent: 240,
      },
    }),
    prisma.trainingProgress.create({
      data: {
        distributorId: distributors[0].id,
        trainingModuleId: trainingModules[2].id,
        partnershipId: partnerships[0].id,
        status: TrainingStatus.in_progress,
        progressPercentage: 65,
        startedAt: new Date('2024-08-25'),
        timeSpent: 78,
      },
    }),
    // Distributor 2 progress on Industrial modules
    prisma.trainingProgress.create({
      data: {
        distributorId: distributors[1].id,
        trainingModuleId: trainingModules[3].id,
        partnershipId: partnerships[1].id,
        status: TrainingStatus.completed,
        progressPercentage: 100,
        startedAt: new Date('2024-09-06'),
        completedAt: new Date('2024-09-07'),
        timeSpent: 300,
      },
    }),
    prisma.trainingProgress.create({
      data: {
        distributorId: distributors[1].id,
        trainingModuleId: trainingModules[4].id,
        partnershipId: partnerships[1].id,
        status: TrainingStatus.in_progress,
        progressPercentage: 45,
        startedAt: new Date('2024-09-08'),
        timeSpent: 162,
      },
    }),
  ]);

  console.log('📊 Created training progress records');

  // 10. Create Distributor Access
  const distributorAccess = await Promise.all([
    prisma.distributorAccess.create({
      data: {
        partnershipId: partnerships[0].id,
        slackWorkspaceUrl: 'https://techcorp-partners.slack.com',
        slackInviteSent: true,
        slackInviteAccepted: true,
        portalUsername: 'emily.rodriguez@fastdist.com',
        portalTempPassword: 'TempPass123!',
        portalPasswordChanged: true,
        accessGrantedAt: new Date('2024-08-21'),
      },
    }),
    prisma.distributorAccess.create({
      data: {
        partnershipId: partnerships[1].id,
        slackWorkspaceUrl: 'https://innovate-network.slack.com',
        slackInviteSent: true,
        slackInviteAccepted: true,
        portalUsername: 'david.thompson@supplychain.com',
        portalTempPassword: 'SecureTemp456!',
        portalPasswordChanged: true,
        accessGrantedAt: new Date('2024-09-06'),
      },
    }),
    prisma.distributorAccess.create({
      data: {
        partnershipId: partnerships[2].id,
        slackWorkspaceUrl: 'https://techcorp-partners.slack.com',
        slackInviteSent: true,
        slackInviteAccepted: false,
        portalUsername: 'lisa.wang@logistics.com',
        portalTempPassword: 'InitialPass789!',
        portalPasswordChanged: false,
        accessGrantedAt: new Date('2024-09-12'),
      },
    }),
  ]);

  console.log('🔐 Created distributor access records');

  // 11. Create Dashboard Stats
  const dashboardStats = await Promise.all([
    prisma.dashboardStats.create({
      data: {
        vendorId: vendors[0].id,
        totalDistributors: 2,
        availableDistributors: 5,
        assignedDistributors: 2,
        pendingContracts: 1,
        signedContracts: 1,
        trainingCompletionRate: 75.50,
        lastCalculatedAt: new Date(),
      },
    }),
    prisma.dashboardStats.create({
      data: {
        vendorId: vendors[1].id,
        totalDistributors: 2,
        availableDistributors: 3,
        assignedDistributors: 2,
        pendingContracts: 1,
        signedContracts: 1,
        trainingCompletionRate: 82.25,
        lastCalculatedAt: new Date(),
      },
    }),
    prisma.dashboardStats.create({
      data: {
        vendorId: vendors[2].id,
        totalDistributors: 0,
        availableDistributors: 4,
        assignedDistributors: 0,
        pendingContracts: 0,
        signedContracts: 0,
        trainingCompletionRate: 0.00,
        lastCalculatedAt: new Date(),
      },
    }),
  ]);

  console.log('📈 Created dashboard statistics');

  // 12. Create Notifications
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        userId: vendorUsers[0].id,
        title: 'New Partnership Activated',
        message: 'Your partnership with FastDist Networks for AI Analytics Platform has been activated successfully.',
        type: NotificationType.partnership_update,
        isRead: false,
        relatedId: partnerships[0].id,
        relatedType: 'partnership',
      },
    }),
    prisma.notification.create({
      data: {
        userId: distributorUsers[0].id,
        title: 'Training Module Completed',
        message: 'Congratulations! You have completed the CRM Software Fundamentals training module.',
        type: NotificationType.training,
        isRead: true,
        relatedId: trainingModules[0].id,
        relatedType: 'training_module',
        readAt: new Date('2024-08-23'),
      },
    }),
    prisma.notification.create({
      data: {
        userId: vendorUsers[1].id,
        title: 'Contract Signed',
        message: 'SupplyChain Pro has signed the distribution contract for Smart Factory Automation Suite.',
        type: NotificationType.contract,
        isRead: false,
        relatedId: contracts[1].id,
        relatedType: 'contract',
      },
    }),
    prisma.notification.create({
      data: {
        userId: distributorUsers[2].id,
        title: 'New Contract Available',
        message: 'A new distribution contract for Enterprise CRM Software is ready for your review and signature.',
        type: NotificationType.contract,
        isRead: false,
        relatedId: contracts[2].id,
        relatedType: 'contract',
      },
    }),
    prisma.notification.create({
      data: {
        userId: vendorUsers[0].id,
        title: 'New Product Request Match',
        message: 'Your Enterprise CRM Software has been matched with a potential distributor in Eastern Europe.',
        type: NotificationType.product_request,
        isRead: false,
        relatedId: productRequests[0].id,
        relatedType: 'product_request',
      },
    }),
  ]);

  console.log('🔔 Created notifications');

  // 13. Create Automated Alerts
  const automatedAlerts = await Promise.all([
    prisma.automatedAlert.create({
      data: {
        userId: distributorUsers[2].id,
        alertType: AlertType.contract_pending,
        title: 'Contract Signature Required',
        message: 'Your distribution contract for Enterprise CRM Software has been pending signature for 5 days. Please review and sign to activate the partnership.',
        relatedId: contracts[2].id,
        relatedType: 'contract',
        priority: AlertPriority.high,
        isSent: false,
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      },
    }),
    prisma.automatedAlert.create({
      data: {
        userId: distributorUsers[1].id,
        alertType: AlertType.training_incomplete,
        title: 'Training Module Incomplete',
        message: 'You have an incomplete training module: Factory Automation Systems. Please complete it to maintain your certification status.',
        relatedId: trainingModules[4].id,
        relatedType: 'training_module',
        priority: AlertPriority.medium,
        isSent: true,
        sentAt: new Date(),
      },
    }),
    prisma.automatedAlert.create({
      data: {
        userId: distributorUsers[3].id,
        alertType: AlertType.onboarding_stalled,
        title: 'Onboarding Process Stalled',
        message: 'Your onboarding process has not progressed in 14 days. Please contact support for assistance.',
        relatedId: distributors[3].id,
        relatedType: 'distributor',
        priority: AlertPriority.medium,
        isSent: false,
        scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
      },
    }),
    prisma.automatedAlert.create({
      data: {
        userId: vendorUsers[0].id,
        alertType: AlertType.partnership_request,
        title: 'New Partnership Request',
        message: 'Regional Distribution has expressed interest in your IoT Sensors product. Review their profile and consider the partnership.',
        relatedId: partnerships[3].id,
        relatedType: 'partnership',
        priority: AlertPriority.low,
        isSent: true,
        sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
    }),
  ]);

  console.log('⚠️  Created automated alerts');

  // 14. Create Activity Logs
  const activityLogs = await Promise.all([
    prisma.activityLog.create({
      data: {
        userId: vendorUsers[0].id,
        action: 'LOGIN',
        entityType: 'USER',
        entityId: vendorUsers[0].id,
        description: 'Vendor login successful',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    }),
    prisma.activityLog.create({
      data: {
        userId: distributorUsers[0].id,
        action: 'CONTRACT_SIGNED',
        entityType: 'CONTRACT',
        entityId: contracts[0].id,
        description: 'Distribution contract signed for AI Analytics Platform',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    }),
    prisma.activityLog.create({
      data: {
        userId: vendorUsers[1].id,
        action: 'PRODUCT_REQUEST_CREATED',
        entityType: 'PRODUCT_REQUEST',
        entityId: productRequests[2].id,
        description: 'Created new product request for Industrial IoT Sensors',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      },
    }),
    prisma.activityLog.create({
      data: {
        userId: distributorUsers[1].id,
        action: 'TRAINING_COMPLETED',
        entityType: 'TRAINING_MODULE',
        entityId: trainingModules[3].id,
        description: 'Completed training module: Industrial IoT Installation Guide',
        ipAddress: '192.168.1.103',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    }),
    prisma.activityLog.create({
      data: {
        userId: vendorUsers[0].id,
        action: 'PARTNERSHIP_CREATED',
        entityType: 'PARTNERSHIP',
        entityId: partnerships[2].id,
        description: 'New partnership created with Logistics Excellence',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    }),
  ]);

  console.log('📝 Created activity logs');

  // 15. Create System Settings
  const systemSettings = await Promise.all([
    prisma.systemSetting.create({
      data: {
        settingKey: 'platform_commission_rate',
        settingValue: '5.0',
        description: 'Default platform commission rate percentage for new partnerships',
        updatedBy: adminUser.id,
      },
    }),
    prisma.systemSetting.create({
      data: {
        settingKey: 'max_active_partnerships_per_distributor',
        settingValue: '10',
        description: 'Maximum number of active partnerships allowed per distributor',
        updatedBy: adminUser.id,
      },
    }),
    prisma.systemSetting.create({
      data: {
        settingKey: 'contract_expiry_notification_days',
        settingValue: '30',
        description: 'Number of days before contract expiry to send notification',
        updatedBy: adminUser.id,
      },
    }),
    prisma.systemSetting.create({
      data: {
        settingKey: 'training_completion_grace_period',
        settingValue: '14',
        description: 'Grace period in days for mandatory training completion',
        updatedBy: adminUser.id,
      },
    }),
    prisma.systemSetting.create({
      data: {
        settingKey: 'vendor_verification_required',
        settingValue: 'true',
        description: 'Whether vendor verification is required before creating product requests',
        updatedBy: adminUser.id,
      },
    }),
    prisma.systemSetting.create({
      data: {
        settingKey: 'distributor_onboarding_timeout_days',
        settingValue: '30',
        description: 'Maximum days allowed for distributor onboarding process',
        updatedBy: adminUser.id,
      },
    }),
  ]);

  console.log('⚙️  Created system settings');

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary of created records:');
  console.log(`👥 Users: ${vendorUsers.length + distributorUsers.length + 1}`);
  console.log(`🏢 Vendors: ${vendors.length}`);
  console.log(`📦 Distributors: ${distributors.length}`);
  console.log(`📋 Product Requests: ${productRequests.length}`);
  console.log(`🤝 Partnerships: ${partnerships.length}`);
  console.log(`📄 Contract Templates: ${contractTemplates.length}`);
  console.log(`📋 Contracts: ${contracts.length}`);
  console.log(`🎓 Training Modules: ${trainingModules.length}`);
  console.log(`📊 Training Progress: ${trainingProgress.length}`);
  console.log(`🔐 Distributor Access: ${distributorAccess.length}`);
  console.log(`📈 Dashboard Stats: ${dashboardStats.length}`);
  console.log(`🔔 Notifications: ${notifications.length}`);
  console.log(`⚠️  Automated Alerts: ${automatedAlerts.length}`);
  console.log(`📝 Activity Logs: ${activityLogs.length}`);
  console.log(`⚙️  System Settings: ${systemSettings.length}`);

  console.log('\n🧪 Test Credentials:');
  console.log('Vendors:');
  console.log('  - vendor1@techcorp.com / password123');
  console.log('  - vendor2@innovate.com / password123');
  console.log('  - vendor3@globaltech.com / password123');
  console.log('\nDistributors:');
  console.log('  - distributor1@fastdist.com / password123');
  console.log('  - distributor2@supplychain.com / password123');
  console.log('  - distributor3@logistics.com / password123');
  console.log('  - distributor4@regionaldist.com / password123');
  console.log('\nAdmin:');
  console.log('  - admin@citplatform.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
