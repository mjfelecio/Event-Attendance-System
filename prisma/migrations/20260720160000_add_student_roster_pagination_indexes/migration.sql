-- Indexes for the server-paginated student roster. These cover its three
-- supported sort modes and the category entry points used by selection boards.
CREATE INDEX "Student_updatedAt_id_idx" ON "Student"("updatedAt", "id");
CREATE INDEX "Student_lastName_firstName_id_idx" ON "Student"("lastName", "firstName", "id");
CREATE INDEX "Student_schoolLevel_yearLevel_lastName_firstName_id_idx" ON "Student"("schoolLevel", "yearLevel", "lastName", "firstName", "id");
CREATE INDEX "Student_schoolLevel_departmentSlug_updatedAt_id_idx" ON "Student"("schoolLevel", "departmentSlug", "updatedAt", "id");
CREATE INDEX "Student_schoolLevel_shsStrand_updatedAt_id_idx" ON "Student"("schoolLevel", "shsStrand", "updatedAt", "id");
CREATE INDEX "Student_houseSlug_updatedAt_id_idx" ON "Student"("houseSlug", "updatedAt", "id");
