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
            $table->foreignId('journal_id')->constrained()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_monthly_receivable_ledgers', function (Blueprint $table) {
            $table->dropForeign('journal_id');
        });
    }
};