<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('student_monthly_receivable_ledgers', function (Blueprint $table) {
            $table->string('study_year');
            $table->dropColumn('year');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_monthly_receivable_ledgers', function (Blueprint $table) {
            $table->dropColumn('study_year');
            $table->integer('year');
        });
    }
};
