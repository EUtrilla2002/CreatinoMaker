    addi a0, a0, 5
    addi a1, a1, 1
    jal ra, 0x100
    addi a0, a0, -5
    addi a0, a0, 1000
    jal ra, 0x104
    addi a0, a0, -1000
    addi a0, a0, 5
    addi a1, a1, -1
    addi a1, a1, 0
    jal ra, 0x100
    addi a0, a0, 1
    addi a1, a1, 1
    jal ra, 0x100
    addi a0, a0, -6
    addi a0, a0, 1000
    jal ra, 0x104
    addi a0, a0, -994
    addi a0, a0, 6
    addi a1, a1, 0
    jal ra, 0x100