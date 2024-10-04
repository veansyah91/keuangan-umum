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
        Schema::table('student_entry_payments', function (Blueprint $table) {
            $table->bigInteger('receivable_value')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_entry_payments', function (Blueprint $table) {
            $table->dropColumn('receivable_value');
        });
    }
};
