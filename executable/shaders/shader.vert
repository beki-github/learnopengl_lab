#version 430 core

layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aNormal;
layout (location=2)   in vec2 aTex;




layout (location =0) uniform mat4 model;
layout (location =1) uniform mat4 view;
layout (location =2) uniform mat4 projection;
layout (location =5) uniform vec3 vPos;


out vec2 texCoord;
out vec3 Normal;
out vec3 fragPos;
out vec3 viewPos;

void main()
    {
       gl_Position = projection*view*model*vec4(aPos.x, aPos.y, aPos.z, 1.0);
       fragPos=vec3(model*vec4(aPos,1.0f));
       Normal = mat3(transpose(inverse(model))) * aNormal;
       viewPos=vPos;
       texCoord=aTex;
    }
