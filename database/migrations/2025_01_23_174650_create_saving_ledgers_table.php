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
        Schema::create('saving_ledgers', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('organization_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('saving_balance_id');
            $table->foreign('saving_balance_id')->references('id')->on('saving_balances');
            $table->foreignId('journal_id')->constrained()->cascadeOnDelete();
            $table->bigInteger('debit')->default(0);
            $table->bigInteger('credit')->default(0);
            $table->date('date');
            $table->string('description')->nullable();
            $table->string('no_ref');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saving_ledgers');
    }
};
