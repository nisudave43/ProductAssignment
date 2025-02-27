// Route-related constants
export const DEFAULT_ROUTE = '/dashboard';
export const NOT_PROTECTED_ROUTE = ['/login', '/forgotpassword', '/resetpassword', '/register', '/enrollment', '/enrollment/new', '/enrollment/retrieve', '/about', '/contact', '/training']; // Add asPath value in NOT_PROTECTED_ROUTE
export const PAGE_WITHOUT_LAYOUT_NAVIGATION = ['/accessdenied']; // Add pathname value in PAGE_WITHOUT_LAYOUT_NAVIGATION
export const PAGE_WITHOUT_PERMISSION = ['/profile', '/accessdenied', '/home']; // Add pathname value in PAGE_WITHOUT_PERMISSION

// Page-related constants
export const PAGES_WITH_FOOTER = ['/login']; // Add pathname value in PAGES_WITH_FOOTER

export const PAGE_WITH_WHITE_BG = ['/login']; // Add pathname value in PAGE_WITH_WHITE_BG

// Localization
export const SUPPORTED_LANGUAGES = [
    {
        'label': 'English',
        'value': 'en',
    },
    {
        'label': 'Spanish',
        'value': 'es',
    },
]; // Supported languages
export const DEFAULT_LANGUAGE = 'en'; // Default language

// Theme-related constants
export const DEFAULT_THEME = 'light'; // Application default theme
export const SUPPORTED_THEME = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
}; // Application supported themes

export const THEME_DATA_ATTRIBUTE_NAME = 'data-theme'; // Theme data attribute name

// Regular expressions
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Password by default regex
export const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // Email Regex
export const LENGTH_VALIDATION_REGEX = /^(?=.{8,}$)/; // Length Validation Regex
export const PASSWORD_WITHOUT_LENGTH_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/; // Password validation without length Regex
export const ZIP_CODE_REGEX = /^\d{5}$/;

// File attachment size
export const ATTACHMENT_SIZE = 102400; // 100KB maximum attachment size


// Enrollment
export const RESEND_OTP_TIME = 10000; // resend otp time in milliseconds
export const OTP_DIGITS = 6; // otp digit
export const CAPTCHA_SITE_KEY = '6LewLIIpAAAAAHuRiDRpLejTCvgPJv68fYXtbqK1';
export const APPLICATION_NUMBER_LENGTH = '12';
export const VFC_CERTIFICATION_MAX_UPLOAD = 10;
export const MAXIMUM_FILE_SIZE_KB = 2048;

// Object to store application status constants
export const APPLICATION_STATUS_OBJECT = {
    'accept': 'APPROVED', // Status for accepted applications
    'reject': 'REJECTED', // Status for rejected applications
    'modification': 'MODIFICATIONS_REQUIRED', // Status for applications needing modification
    'review': 'UNDER_REVIEW', // Status of application for under review
};

//Filters default value
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_FILTER_PAGE = 1;

//Daypicker ToYear
export const DAYPICKER_FROM_YEAR = 1920;

// File formats according to first bytes
export const FILE_FORMATS = {
    '89504e47': 'png',  // PNG
    '25504446': 'pdf',  // PDF
    'ffd8ffe0': 'jpg',  // JPG (JPEG)
    'ffd8ffe1': 'jpg',  // JPG (JPEG)
    'ffd8ffe2': 'jpg',  // JPG (JPEG)
    '47494638': 'gif',  // GIF
    '504b0304': 'zip',  // ZIP
};
// FIle download mime type
export const MIME_TYPE = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    txt: 'text/plain',
    csv: 'text/csv',
    xml: 'application/xml',
    html: 'text/html',
    jrxml: 'text/xml',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
};

// File accept type
export const FILE_ACCEPT_TYPE = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    txt: 'text/plain',
    csv: 'text/csv',
    xml: 'application/xml',
    html: 'text/html',
    jrxml: '.jrxml',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
};

export const DASHBOARD_TYPE = {
    'management': 'Management',
    'admin': 'Admin',
    'transactional': 'Transactional',
    'special': '',
};

export const DASHBOARD_TYPE_APIS = {
    'Management': 'Admin',
    'Admin': 'Admin',
    'Transactional': 'Transactional',
    'Special': '',
};

export const NOTIFICATION_AUTO_HIDE_DURATION = 1500;
