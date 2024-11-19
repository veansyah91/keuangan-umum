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
        Schema::table('whatsapp_invoices', function (Blueprint $table) {
            $table->unsignedBigInteger('accepted_by_user_id')->nullable();
            $table->foreign('accepted_by_user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('whatsapp_invoices', function (Blueprint $table) {
            $table->dropForeign('accepted_by_user_id');
        });
    }
};
