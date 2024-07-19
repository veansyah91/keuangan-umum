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
        Schema::table('school_account_settings', function (Blueprint $table) {
            $table->boolean('update_level_auto')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('school_account_settings', function (Blueprint $table) {
            $table->dropColumn('update_level_auto');
        });
    }
};
