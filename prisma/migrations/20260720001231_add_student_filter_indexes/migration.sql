-- CreateIndex
CREATE INDEX "Event_status_start_idx" ON "Event"("status", "start");

-- CreateIndex
CREATE INDEX "Student_status_schoolLevel_idx" ON "Student"("status", "schoolLevel");

-- CreateIndex
CREATE INDEX "Student_status_departmentSlug_idx" ON "Student"("status", "departmentSlug");

-- CreateIndex
CREATE INDEX "Student_status_houseSlug_idx" ON "Student"("status", "houseSlug");

-- CreateIndex
CREATE INDEX "Student_status_collegeProgram_idx" ON "Student"("status", "collegeProgram");

-- CreateIndex
CREATE INDEX "Student_status_shsStrand_idx" ON "Student"("status", "shsStrand");

-- CreateIndex
CREATE INDEX "Student_status_section_idx" ON "Student"("status", "section");

-- CreateIndex
CREATE INDEX "Student_status_yearLevel_idx" ON "Student"("status", "yearLevel");
