# CSIT314 - Coding Checklist

## Backend OOP
- [ ] Classes defined for every entity (no plain functions doing logic)
- [ ] Each class has clear responsibilities (no god classes)
- [ ] Controller → Service → Repository → Model layers separated

## BCE Pattern
- [ ] Boundary layer (routes/API endpoints)
- [ ] Controller layer (handles request logic)
- [ ] Entity layer (models/data classes)

## Test Driven Development
- [ ] Write failing test first, then code
- [ ] Unit tests for each feature/function
- [ ] Screenshot test runs as evidence for report
- [ ] Tests passing before merging to main

## CI/CD
- [ ] GitHub Actions pipeline set up
- [ ] Pipeline runs tests automatically on push
- [ ] At least one feature shows full deploy pipeline
- [ ] Screenshot pipeline runs for report

## Check with UML
- [ ] Class names match the UML class diagram
- [ ] Methods/attributes match what's designed
- [ ] Sequence diagrams reflected in actual code flow
- [ ] Sync with whoever does design if anything changes

## Test Data
- [ ] Script written to generate ~100 records per data type
- [ ] Data covers all roles (User Admin, FR, Donee, Platform Management)
- [ ] Data is realistic enough for live demo