#import "Common/ShaderLib/MultiSample.glsllib"
#import "Common/ShaderLib/GLSLCompat.glsllib"

#if defined(HAS_GLOWMAP) || defined(HAS_COLORMAP) || (defined(HAS_LIGHTMAP) && !defined(SEPARATE_TEXCOORD))
    #define NEED_TEXCOORD1
#endif

#if defined(DISCARD_ALPHA)
    uniform float m_AlphaDiscardThreshold;
#endif

uniform vec4 m_Color;
uniform sampler2D m_ColorMap;
uniform sampler2D m_LightMap;

in vec2 texCoord1;
in vec2 texCoord2;
in vec4 vertColor;

out vec4 outColor;

void main(){
    outColor = vec4(1.0);

    #ifdef HAS_COLORMAP
        outColor *= texture2D(m_ColorMap, texCoord1);     
    #endif

    #ifdef HAS_VERTEXCOLOR
        outColor *= vertColor;
    #endif

    #ifdef HAS_COLOR
        outColor *= m_Color;
    #endif

    #ifdef HAS_LIGHTMAP
        #ifdef SEPARATE_TEXCOORD
            outColor.rgb *= texture2D(m_LightMap, texCoord2).rgb;
        #else
            outColor.rgb *= texture2D(m_LightMap, texCoord1).rgb;
        #endif
    #endif

    #if defined(DISCARD_ALPHA)
        if(outColor.a < m_AlphaDiscardThreshold){
           discard;
        }
    #endif
}