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
        Schema::create('ledgers', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('debit')->default(0);
            $table->bigInteger('credit')->default(0);
            $table->date('date');
            $table->string('description')->nullable();
            $table->string('no_ref');

            $table->unsignedBigInteger('contact_id')->nullable();          
            $table->foreign('contact_id')->references('id')->on('contacts');

            $table->foreignId('account_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('organization_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ledgers');
    }
};
