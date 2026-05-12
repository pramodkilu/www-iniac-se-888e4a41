# School Dashboard Screen Flow

This document defines the first product structure for the INIAC school dashboard across web, iOS, and Android. The goal is to keep each module small, role-aware, and easy to build incrementally.

## User Roles

### Super Admin

Platform-level owner for INIAC.

- Manage schools and campuses
- Manage school admin users
- View all programs, batches, students, teachers, reports, and billing status
- Configure platform-level settings

### School Admin

School-level operations user.

- Manage programs and batches
- Manage teachers, students, and parent accounts
- Track attendance and reports
- Send school/program updates
- Review payments when payment module is enabled

### Teacher / Instructor

Classroom and activity delivery user.

- View assigned sessions
- Mark attendance
- Open curriculum modules
- Add student notes and progress updates
- Upload evidence of student work

### Parent

Guardian user.

- View child progress
- View attendance summaries
- Receive teacher/admin updates
- View upcoming sessions and events
- View payment status when payment module is enabled

### Student

Learning user.

- View assigned programs and lessons
- Track progress and achievements
- Submit activities or project evidence
- View badges, competitions, and upcoming sessions

## Login Flow

1. User opens web app or mobile app.
2. User lands on login screen.
3. User enters email/phone and password, or chooses a supported social login.
4. Supabase Auth validates the session.
5. App fetches the user profile and role.
6. App routes user to the correct dashboard:
   - `super_admin` -> Super Admin Dashboard
   - `school_admin` -> School Admin Dashboard
   - `teacher` -> Teacher Dashboard
   - `parent` -> Parent Dashboard
   - `student` -> Student Dashboard
7. If user has no role assigned, show pending access screen.
8. If user belongs to multiple schools, show school selector before dashboard.

## Dashboard Flow

### Super Admin Dashboard

Primary flow:

1. View platform overview.
2. Select a school.
3. Review school programs, users, attendance, progress, and reports.
4. Manage platform settings.

Key screens:

- Overview
- Schools
- Programs
- Users
- Reports
- Billing
- Settings

### School Admin Dashboard

Primary flow:

1. View school overview.
2. Manage programs and batches.
3. Assign teachers.
4. Add or import students.
5. Invite parents.
6. Review attendance and progress reports.
7. Send updates.

Key screens:

- Dashboard
- Students
- Teachers
- Parents
- Programs
- Batches
- Attendance
- Reports
- Updates
- Settings

### Teacher Dashboard

Primary flow:

1. View today's sessions.
2. Open a session.
3. Review objective and curriculum content.
4. Mark attendance.
5. Add notes/progress for students.
6. Complete session.

Key screens:

- Dashboard
- Sessions
- Attendance
- Students
- Curriculum
- Progress
- Reports

### Parent Dashboard

Primary flow:

1. Select child.
2. View weekly summary.
3. Review attendance, progress, and teacher updates.
4. View upcoming events.
5. Review payment status when enabled.

Key screens:

- Dashboard
- Children
- Progress
- Attendance
- Updates
- Events
- Payments

### Student Dashboard

Primary flow:

1. View active programs.
2. Continue current lesson/module.
3. Submit activity or project evidence.
4. Track achievements.
5. View upcoming sessions and competitions.

Key screens:

- Dashboard
- Programs
- Lessons
- Projects
- Achievements
- Events

## Navigation Map

### Public Website

- Home
- Education & Schools
- Innovation & Startups
- Programs
- Curriculum
- Partners
- About INIAC
- Contact
- Sign In

### Authenticated Web Dashboard

- Dashboard
- Schools
- Programs
- Batches
- Sessions
- Students
- Teachers
- Parents
- Attendance
- Curriculum
- Reports
- Updates
- Payments
- Settings

### Mobile App Navigation

Bottom navigation should stay role-specific and compact.

Teacher:

- Home
- Sessions
- Students
- Reports
- More

Parent:

- Home
- Children
- Updates
- Events
- More

Student:

- Home
- Programs
- Lessons
- Achievements
- More

School Admin:

- Home
- Programs
- Students
- Reports
- More

## Data Tables Required

These are product-level data tables/views needed in the UI.

### Core Admin Tables

- Schools table
- Campuses table
- Users table
- Role assignments table
- Programs table
- Batches table
- Sessions table

### Student Management Tables

- Students table
- Student guardians table
- Student enrollment table
- Student progress table
- Student notes table
- Student achievements table

### Teaching Tables

- Teacher assignments table
- Session attendance table
- Curriculum modules table
- Lessons table
- Activities table
- Project submissions table

### Reporting Tables

- Attendance summary table
- Program performance table
- Batch performance table
- Student progress summary table
- Payment summary table
- Parent communication summary table

## Supabase Tables Required

### Auth/Profile

- `profiles`
  - `id`
  - `auth_user_id`
  - `full_name`
  - `email`
  - `phone`
  - `avatar_url`
  - `default_role`
  - `created_at`
  - `updated_at`

- `user_roles`
  - `id`
  - `user_id`
  - `school_id`
  - `role`
  - `created_at`

### School Structure

- `schools`
  - `id`
  - `name`
  - `slug`
  - `address`
  - `status`
  - `created_at`

- `campuses`
  - `id`
  - `school_id`
  - `name`
  - `address`
  - `created_at`

### Programs And Batches

- `programs`
  - `id`
  - `school_id`
  - `name`
  - `description`
  - `category`
  - `age_range`
  - `status`
  - `created_at`

- `batches`
  - `id`
  - `program_id`
  - `school_id`
  - `teacher_id`
  - `name`
  - `grade_range`
  - `schedule`
  - `capacity`
  - `status`
  - `created_at`

- `sessions`
  - `id`
  - `batch_id`
  - `teacher_id`
  - `title`
  - `starts_at`
  - `ends_at`
  - `objective`
  - `status`
  - `created_at`

### Students And Parents

- `students`
  - `id`
  - `school_id`
  - `full_name`
  - `grade`
  - `date_of_birth`
  - `status`
  - `created_at`

- `parents`
  - `id`
  - `profile_id`
  - `school_id`
  - `created_at`

- `student_parents`
  - `id`
  - `student_id`
  - `parent_id`
  - `relationship`
  - `is_primary`

- `enrollments`
  - `id`
  - `student_id`
  - `batch_id`
  - `status`
  - `enrolled_at`

### Attendance And Progress

- `attendance_records`
  - `id`
  - `session_id`
  - `student_id`
  - `status`
  - `marked_by`
  - `note`
  - `created_at`

- `student_progress`
  - `id`
  - `student_id`
  - `program_id`
  - `batch_id`
  - `module_id`
  - `progress_percent`
  - `skill_notes`
  - `updated_by`
  - `updated_at`

- `student_notes`
  - `id`
  - `student_id`
  - `session_id`
  - `teacher_id`
  - `note`
  - `visibility`
  - `created_at`

### Curriculum

- `curriculum_modules`
  - `id`
  - `program_id`
  - `title`
  - `description`
  - `sort_order`
  - `status`

- `lessons`
  - `id`
  - `module_id`
  - `title`
  - `objective`
  - `content`
  - `materials`
  - `sort_order`

- `activities`
  - `id`
  - `lesson_id`
  - `title`
  - `instructions`
  - `activity_type`
  - `estimated_minutes`

- `project_submissions`
  - `id`
  - `student_id`
  - `activity_id`
  - `file_url`
  - `comment`
  - `status`
  - `submitted_at`

### Communication

- `announcements`
  - `id`
  - `school_id`
  - `batch_id`
  - `title`
  - `message`
  - `audience`
  - `created_by`
  - `created_at`

- `messages`
  - `id`
  - `school_id`
  - `sender_id`
  - `recipient_id`
  - `student_id`
  - `subject`
  - `body`
  - `read_at`
  - `created_at`

## Future Payment Module

Payment support should be added after core school operations are stable.

### Payment Features

- Program fee setup
- Student invoice generation
- Parent payment status
- Manual Swish tracking
- Stripe payment integration
- Payment reminders
- Receipts
- Admin payment reports

### Future Supabase Tables

- `fee_plans`
- `invoices`
- `invoice_items`
- `payments`
- `payment_methods`
- `payment_reminders`

### Payment Flow

1. Admin creates fee plan for a program or batch.
2. System generates invoices for enrolled students.
3. Parent sees invoice in app.
4. Parent pays through Stripe or external Swish/manual flow.
5. Admin verifies payment if manual.
6. System updates invoice status.
7. Parent receives receipt/update.

## Future AI Robotics Learning Module

This module should support AI/robotics curriculum delivery and project-based learning.

### Features

- AI curriculum modules
- Robotics build guides
- Lesson objectives
- Materials list
- Step-by-step activities
- Student project submissions
- Teacher assessment
- Skill achievement tracking
- Competition preparation

### Future Enhancements

- AI assistant for lesson help
- Image recognition activity checks
- Robotics build verification
- Student project portfolio
- Teacher-generated feedback
- Adaptive lesson recommendations

### Suggested Flow

1. Student opens assigned module.
2. Student reviews lesson objective.
3. Student completes activity.
4. Student submits project evidence.
5. Teacher reviews submission.
6. System updates progress and achievements.

## Parent Communication Module

Parent communication should be simple, structured, and tied to student context.

### Communication Types

- School-wide announcements
- Program/batch updates
- Teacher progress notes
- Attendance alerts
- Event reminders
- Payment reminders
- Achievement updates

### Parent Flow

1. Parent opens app.
2. Parent selects child.
3. Parent sees latest updates.
4. Parent opens attendance/progress/payment details.
5. Parent can reply where enabled.

### Admin/Teacher Flow

1. Admin or teacher selects audience.
2. User writes update.
3. User links update to student, batch, program, or school.
4. System sends in-app notification.
5. Optional email/push notification is sent.
6. Read status is tracked.

## Build Order Recommendation

1. Auth and role routing
2. School Admin dashboard shell
3. Programs and batches
4. Students and enrollments
5. Teacher sessions and attendance
6. Parent dashboard and updates
7. Reports
8. Payments
9. AI robotics learning module
