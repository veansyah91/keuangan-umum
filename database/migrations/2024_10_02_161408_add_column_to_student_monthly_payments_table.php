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
        Schema::table('student_monthly_payments', function (Blueprint $table) {
            $table->unsignedBigInteger('prepaid_journal_id')->nullable();
            $table->foreign('prepaid_journal_id')->references('id')->on('journals');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_monthly_payments', function (Blueprint $table) {
            //
        });
    }
};
