# Security Specification & Test Matrix: Ceylon Style Studio

## 1. Data Invariants
- `registrations`: Public users can CREATE new registration submissions if required fields (regNumber, fullName, whatsappNumber, district, courseType) are provided and within bounds. Public users CANNOT list, read others' registrations, update, or delete registrations. Only authenticated Admins can read, query, update, or delete registrations.
- `site_settings`: Public read allowed. Writes restricted strictly to authenticated Admins.
- `course_modules`: Public read allowed. Writes restricted strictly to authenticated Admins.
- `youtube_videos`: Public read allowed. Writes restricted strictly to authenticated Admins.
- `gallery_images`: Public read allowed. Writes restricted strictly to authenticated Admins.
- `locations`: Public read allowed. Writes restricted strictly to authenticated Admins.
- `faqs`: Public read allowed. Writes restricted strictly to authenticated Admins.
- `admins`: Read & write restricted strictly to superadmins / verified admin accounts matching trusted list or bootstrapped email `asankagarments@gmail.com`.

## 2. The "Dirty Dozen" Threat Payloads
1. **Ghost Field Registration Injection**: An unauthenticated user attempts to create a registration with an extra elevated field `role: 'admin'` or `status: 'CONFIRMED'` without admin authorization. -> Rejected.
2. **Denial-of-Wallet Registration Payload**: An unauthenticated user attempts to submit a registration with 1MB payload string in fullName or notes. -> Rejected (length check <= 150).
3. **Public Data Exfiltration Attack**: An unauthenticated or standard student user attempts to call `getDocs(collection(db, 'registrations'))` to download competitor or student phone numbers. -> PERMISSION_DENIED.
4. **Forged Status Modification**: An unauthenticated user sends an update to change their own or another user's registration status to `PAID`. -> PERMISSION_DENIED.
5. **Unauthorized CMS Content Defacement**: An unauthenticated attacker attempts to overwrite `site_settings/main` with phishing links. -> PERMISSION_DENIED.
6. **Malicious Video Injection**: An unauthenticated attacker attempts to add an unverified video to `youtube_videos`. -> PERMISSION_DENIED.
7. **Admins Self-Promotion**: An unauthenticated user tries to write a record to `/admins/attacker_uid`. -> PERMISSION_DENIED.
8. **Invalid Path Injections**: An attacker provides a 1000-character malicious path ID to access resources. -> Blocked via `isValidId()`.
9. **Email Spoofing Attack**: An attacker creates an unverified account with the admin's email and attempts to mutate records. -> Blocked via `email_verified == true`.
10. **Module Order Poisoning**: Sending non-numeric or out-of-bound order fields into `course_modules`. -> Blocked by validation helper.
11. **Gallery Image URL Overflow**: Injected payload exceeding 2,000 characters for `imageUrl`. -> Blocked by boundary constraints.
12. **Orphaned Registration Deletion**: An unauthenticated user attempts to delete a registration record. -> PERMISSION_DENIED.
